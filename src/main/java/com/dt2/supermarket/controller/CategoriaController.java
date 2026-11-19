package com.dt2.supermarket.controller;

import com.dt2.supermarket.entities.Categoria;
import com.dt2.supermarket.repository.CategoriaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {
    private final CategoriaRepository repository;

    public CategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public String cadastrar(@RequestBody Categoria ca) {
        try {
            repository.save(ca);
            return "Calvo com sucesso!";
        }
        catch (Exception e){
            return "Dados incorretos";
        }
    }

    @GetMapping
    public List<Categoria> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public void buscarPorId(@PathVariable int id) {
        repository.findById(id);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Categoria ca) {
        Categoria categoria = repository.getReferenceById(id);
        categoria.setNome(ca.getNome());
        categoria.setDepartamento(ca.getDepartamento());
        categoria.setDescricao(ca.getDescricao());
        repository.save(ca);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable int id) {
        repository.deleteById(id);
        return "Excluído com sucesso!";
    }
}
