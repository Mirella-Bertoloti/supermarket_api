package com.dt2.supermarket.controller;

import com.dt2.supermarket.entities.Fornecedor;
import com.dt2.supermarket.repository.FornecedorRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@CrossOrigin(origins = "*")
public class FornecedorController {

    private final FornecedorRepository repository;
    public FornecedorController(FornecedorRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public String cadastrar(@RequestBody Fornecedor fo) {
        try {
            repository.save(fo);
            return "Calvo com sucesso!";
        }
        catch (Exception e){
            return "Dados incorretos";
        }
    }

    @GetMapping
    public List<Fornecedor> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public void buscarPorId(@PathVariable int id) {
        repository.findById(id);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Fornecedor fo) {
        Fornecedor fornecedor = repository.getReferenceById(id);
        fornecedor.setNome(fo.getNome());
        fornecedor.setCnpj(fo.getCnpj());
        fornecedor.setEmail(fo.getEmail());
        fornecedor.setEndereco(fo.getEndereco());
        fornecedor.setTelefone(fo.getTelefone());
        repository.save(fo);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable int id) {
        repository.deleteById(id);
        return "Excluído com sucesso!";
    }
}
