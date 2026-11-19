const API_BASE = 'http://localhost:8080';

const CONFIG = {
    produtos: {
        singular: 'Produto', plural: 'Produtos', endpoint: '/api/produtos',
        title: 'Catálogo de produtos', description: 'Visualize os itens registrados e pesquise pelo nome ou categoria.',
        button: '＋ CADASTRAR PRODUTO', stats: ['Produtos cadastrados','Categorias disponíveis','Unidades em estoque'],
        fields: [
            {name:'nome',label:'NOME DO PRODUTO',required:true},
            {name:'categoria',label:'CATEGORIA',required:true, type:'select', options:['Açougue','Hortifrúti','Padaria','Mercearia','Laticínios','Bebidas','Congelados','Produtos de limpeza','Higiene pessoal','Pet shop','Outros']},
            {name:'preco',label:'PREÇO (R$)',type:'number',required:true,min:0},
            {name:'quantidade',label:'QUANTIDADE EM ESTOQUE',type:'number',required:true,min:0},
            {name:'urlImagem',label:'URL DA IMAGEM',type:'url',full:true},
            {name:'descricao',label:'DESCRIÇÃO',type:'textarea',full:true}
        ],
        summary: rows => [rows.length,new Set(rows.map(x=>x.categoria).filter(Boolean)).size,rows.reduce((n,x)=>n+Number(x.quantidade||0),0)],
        filter: 'categoria',
        details: x => [`Preço: ${money(x.preco)}`,`Estoque: ${x.quantidade ?? 0} unidade(s)`,x.descricao || 'Sem descrição cadastrada.']
    },
    funcionarios: {
        singular:'Funcionário',plural:'Funcionários',endpoint:'/api/funcionarios',title:'Equipe de funcionários',
        description:'Gerencie os dados dos colaboradores do mercado.',button:'＋ CADASTRAR FUNCIONÁRIO',
        stats:['Funcionários cadastrados','Cargos diferentes','Registros exibidos'],
        fields:[
            {name:'nome',label:'NOME COMPLETO',required:true},{name:'cpf',label:'CPF',required:true},
            {name:'cargo',label:'CARGO',required:true},{name:'telefone',label:'TELEFONE'},
            {name:'salario',label:'SALÁRIO (R$)',type:'number',min:0,step:'0.01',required:true}
        ],
        summary:r=>[r.length,new Set(r.map(x=>x.cargo).filter(Boolean)).size,r.length],
        filter:'cargo',details:x=>[`CPF: ${x.cpf||'—'}`,`Telefone: ${x.telefone||'—'}`,`Salário: ${money(x.salario)}`]
    },
    fornecedores:{
        singular:'Fornecedor',plural:'Fornecedores',endpoint:'/api/fornecedores',title:'Cadastro de fornecedores',
        description:'Consulte e organize os parceiros que fornecem produtos ao mercado.',button:'＋ CADASTRAR FORNECEDOR',
        stats:['Fornecedores cadastrados','Cidades/endereços','Registros exibidos'],
        fields:[
            {name:'nome',label:'NOME / RAZÃO SOCIAL',required:true},{name:'cnpj',label:'CNPJ',required:true},
            {name:'telefone',label:'TELEFONE'},{name:'email',label:'E-MAIL',type:'email'},
            {name:'endereco',label:'ENDEREÇO',full:true}
        ],
        summary:r=>[r.length,new Set(r.map(x=>x.endereco).filter(Boolean)).size,r.length],
        details:x=>[`CNPJ: ${x.cnpj||'—'}`,`Telefone: ${x.telefone||'—'}`,x.email||'E-mail não informado',x.endereco||'Endereço não informado']
    },
    clientes:{
        singular:'Cliente',plural:'Clientes',endpoint:'/api/clientes',title:'Cadastro de clientes',
        description:'Mantenha os dados de contato dos clientes organizados.',button:'＋ CADASTRAR CLIENTE',
        stats:['Clientes cadastrados','E-mails informados','Registros exibidos'],
        fields:[
            {name:'nome',label:'NOME COMPLETO',required:true},{name:'cpf',label:'CPF',required:true},
            {name:'telefone',label:'TELEFONE'},{name:'email',label:'E-MAIL',type:'email'}
        ],
        summary:r=>[r.length,r.filter(x=>x.email).length,r.length],
        details:x=>[`CPF: ${x.cpf||'—'}`,`Telefone: ${x.telefone||'—'}`,x.email||'E-mail não informado']
    },
    categorias:{
        singular:'Categoria',plural:'Categorias',endpoint:'/api/categorias',title:'Categorias de produtos',
        description:'Organize os produtos por categorias e departamentos.',button:'＋ CADASTRAR CATEGORIA',
        stats:['Categorias cadastradas','Departamentos diferentes','Registros exibidos'],
        fields:[
            {name:'nome',label:'NOME DA CATEGORIA',required:true},{name:'departamento',label:'DEPARTAMENTO',required:true},
            {name:'descricao',label:'DESCRIÇÃO',type:'textarea',full:true}
        ],
        summary:r=>[r.length,new Set(r.map(x=>x.departamento).filter(Boolean)).size,r.length],
        filter:'departamento',details:x=>[`Departamento: ${x.departamento||'—'}`,x.descricao||'Sem descrição cadastrada.']
    }
};

let currentSection = 'produtos';
let records = [];
let editingId = null;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => Number(value || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

function toast(message,error=false){
    $('toast').textContent=message;
    $('toast').className='toast'+(error?' error':'');
    $('toast').style.display='block';
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>$('toast').style.display='none',3500);
}
async function api(path,options={}){
    const response=await fetch(`${API_BASE}${path}`,{
        ...options,headers:{'Content-Type':'application/json',...(options.headers||{})}
    });
    if(!response.ok){const detail=await response.text();throw new Error(detail||`HTTP ${response.status}`);}
    if(response.status===204)return null;
    const text=await response.text();
    return text?JSON.parse(text):null;
}
function setSection(section){
    currentSection=section;
    const c=CONFIG[section];
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===section));
    $('welcomeTitle').textContent='Olá! Bem-vinda ao Bloom Market.';
    $('welcomeText').textContent=`Gerencie e consulte ${c.plural.toLowerCase()} cadastrados no mercado.`;
    $('sectionTitle').textContent=c.title;
    $('sectionDescription').textContent=c.description;
    $('newBtn').textContent=c.button;
    c.stats.forEach((s,i)=>$('statLabel'+(i+1)).textContent=s);
    $('search').placeholder=`Buscar ${c.singular.toLowerCase()}...`;
    loadRecords();
}
async function loadRecords(){
    const c=CONFIG[currentSection];
    $('records').innerHTML='<div class="empty"><strong>CARREGANDO...</strong>Consultando a API.</div>';
    try{
        const data=await api(c.endpoint);
        records=(Array.isArray(data)?data:(data?.content||[]));
        updateStats(); updateFilter(); renderRecords();
    }catch(error){
        records=[]; updateStats();
        $('records').innerHTML=`<div class="empty"><strong>NÃO FOI POSSÍVEL CONECTAR À API</strong>Confira se o backend está iniciado e se o endpoint ${esc(c.endpoint)} existe.<br><br><small>${esc(error.message)}</small><br><br><button class="ghost" id="retryBtn">TENTAR NOVAMENTE</button></div>`;
        $('retryBtn').addEventListener('click',loadRecords);
    }
}
function updateStats(){
    const values=CONFIG[currentSection].summary(records);
    values.forEach((v,i)=>$('stat'+(i+1)).textContent=Number(v).toLocaleString('pt-BR'));
}
function updateFilter(){
    const key=CONFIG[currentSection].filter;
    const select=$('filter');
    if(!key){select.innerHTML='<option value="">Todos</option>';select.style.display='none';return;}
    select.style.display='';
    const selected=select.value;
    const values=[...new Set(records.map(x=>x[key]).filter(Boolean))].sort();
    select.innerHTML='<option value="">Todos</option>'+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    select.value=values.includes(selected)?selected:'';
}
function renderRecords(){
    const c=CONFIG[currentSection],term=$('search').value.trim().toLowerCase(),filter=$('filter').value;
    const list=records.filter(item=>{
        const text=Object.values(item).join(' ').toLowerCase();
        return text.includes(term)&&(!c.filter||!filter||item[c.filter]===filter);
    });
    if(!list.length){
        $('records').innerHTML=`<div class="empty"><strong>NENHUM REGISTRO ENCONTRADO</strong>${records.length?'Tente alterar sua pesquisa.':`Cadastre o primeiro ${c.singular.toLowerCase()} para começar.`}</div>`;
        return;
    }
    $('records').innerHTML=list.map(item=>{
        const name=item.nome||item.razaoSocial||c.singular;
        const details=c.details(item).map(x=>`<div class="card-meta">${esc(x)}</div>`).join('');
        const image=currentSection==='produtos'&&item.urlImagem?`<img src="${esc(item.urlImagem)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.remove()">`:'';
        const initial=esc(name.charAt(0).toUpperCase());
        return `<article class="record-card">
      <div class="visual">${image||initial}</div>
      <div class="content"><div class="kind">${esc(c.singular)}</div><h3>${esc(name)}</h3>${details}
      <div class="card-actions">
        <button class="small-btn" data-edit="${esc(item.id)}">EDITAR</button>
        <button class="small-btn delete" data-delete="${esc(item.id)}">EXCLUIR</button>
      </div></div></article>`;
    }).join('');
    $('records').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openForm(Number(b.dataset.edit))));
    $('records').querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>deleteRecord(Number(b.dataset.delete))));
}
function buildFields(item={}){
    const fields=CONFIG[currentSection].fields;
    $('formFields').innerHTML=fields.map(f=>{
        const value=item[f.name]??'';
        let control='';
        if(f.type==='select'){
            control=`<select id="field_${f.name}" ${f.required?'required':''}><option value="">Selecione</option>${f.options.map(o=>`<option ${value===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
        }else if(f.type==='textarea'){
            control=`<textarea id="field_${f.name}" ${f.required?'required':''}>${esc(value)}</textarea>`;
        }else{
            const type=f.type||'text';
            control=`<input id="field_${f.name}" type="${type}" value="${esc(value)}" ${f.required?'required':''} ${f.min!==undefined?`min="${f.min}"`:''} ${f.step?`step="${f.step}"`:''} placeholder="${esc(f.label.toLowerCase())}">`;
        }
        return `<div class="field ${f.full?'full':''}"><label for="field_${f.name}">${esc(f.label)}${f.required?' *':''}</label>${control}</div>`;
    }).join('');
}
function openForm(id=null){
    editingId=id;
    const item=id===null?{}:records.find(x=>Number(x.id)===id);
    buildFields(item||{});
    $('modalTitle').textContent=id===null?`Novo ${CONFIG[currentSection].singular.toLowerCase()}`:`Editar ${CONFIG[currentSection].singular.toLowerCase()}`;
    $('saveBtn').textContent=id===null?'SALVAR':'ATUALIZAR';
    $('backdrop').classList.add('open');
}
function closeForm(){$('backdrop').classList.remove('open');$('recordForm').reset();editingId=null;}
async function saveRecord(event){
    event.preventDefault();
    const c=CONFIG[currentSection],body={};
    c.fields.forEach(f=>{
        const input=$(`field_${f.name}`);
        if(f.type==='number')body[f.name]=input.value===''?0:Number(input.value);
        else body[f.name]=input.value.trim();
    });
    const isEdit=editingId!==null;
    const path=isEdit?`${c.endpoint}/${editingId}`:c.endpoint;
    $('saveBtn').disabled=true;
    try{
        await api(path,{method:isEdit?'PUT':'POST',body:JSON.stringify(body)});
        closeForm();toast(`${c.singular} ${isEdit?'atualizado':'cadastrado'} com sucesso!`);loadRecords();
    }catch(error){toast(`Erro ao salvar: ${error.message}`,true);}
    finally{$('saveBtn').disabled=false;}
}
async function deleteRecord(id){
    if(!confirm(`Deseja realmente excluir este ${CONFIG[currentSection].singular.toLowerCase()}?`))return;
    try{await api(`${CONFIG[currentSection].endpoint}/${id}`,{method:'DELETE'});toast('Registro excluído com sucesso!');loadRecords();}
    catch(error){toast(`Erro ao excluir: ${error.message}`,true);}
}

$('navigation').addEventListener('click',e=>{
    const button=e.target.closest('[data-section]');
    if(button)setSection(button.dataset.section);
});
$('newBtn').addEventListener('click',()=>openForm());
$('closeBtn').addEventListener('click',closeForm);
$('cancelBtn').addEventListener('click',closeForm);
$('backdrop').addEventListener('click',e=>{if(e.target===$('backdrop'))closeForm();});
$('recordForm').addEventListener('submit',saveRecord);
$('search').addEventListener('input',renderRecords);
$('filter').addEventListener('change',renderRecords);
setSection('produtos');
