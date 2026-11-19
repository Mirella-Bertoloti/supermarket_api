package com.dt2.supermarket.controller;

import com.dt2.supermarket.entities.Funcionario;
import com.dt2.supermarket.repository.FuncionarioRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    private final FuncionarioRepository repository;
    public FuncionarioController(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public String cadastrar(@RequestBody Funcionario f) {
        try {
            repository.save(f);
            return "Calvo com sucesso!";
        }
        catch (Exception e){
            return "Dados incorretos";
        }
    }

    @GetMapping
    public List<Funcionario> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public void buscarPorId(@PathVariable int id) {
        repository.findById(id);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Funcionario f) {
        Funcionario funcionario = repository.getReferenceById(id);
        funcionario.setNome(f.getNome());
        funcionario.setCargo(f.getCargo());
        funcionario.setCpf(f.getCpf());
        funcionario.setSalario(f.getSalario());
        funcionario.setTelefone(f.getTelefone());
        repository.save(f);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable int id) {
        repository.deleteById(id);
        return "Excluído com sucesso!";
    }
}
