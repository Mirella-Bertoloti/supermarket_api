package com.dt2.supermarket.controller;

import com.dt2.supermarket.entities.Produto;
import com.dt2.supermarket.repository.ProdutoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoRepository repository;
    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public String cadastrar(@RequestBody Produto p) {
        try {
            repository.save(p);
            return "Calvo com sucesso!";
        }
        catch (Exception e){
            return "Dados incorretos";
        }

    }

    @GetMapping
    public List<Produto> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public void buscarPorId(@PathVariable int id) {
        repository.findById(id);
    }


    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Produto p) {
        Produto produto = repository.getReferenceById(id);
        produto.setNome(p.getNome());
        produto.setCategoria(p.getCategoria());
        produto.setDescricao(p.getDescricao());
        produto.setPreco(p.getPreco());
        produto.setQuantidade(p.getQuantidade());
        produto.setUrlImagem(p.getUrlImagem());
        repository.save(p);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable int id) {
        repository.deleteById(id);
        return "Excluído com sucesso!";
    }
}
