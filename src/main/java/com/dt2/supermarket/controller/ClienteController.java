package com.dt2.supermarket.controller;

import com.dt2.supermarket.entities.Cliente;
import com.dt2.supermarket.repository.ClienteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteRepository repository;
    public ClienteController(ClienteRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public String cadastrar(@RequestBody Cliente c) {
        try {
            repository.save(c);
            return "Calvo com sucesso!";
        }
        catch (Exception e){
            return "Dados incorretos";
        }
    }

    @GetMapping
    public List<Cliente> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public void buscarPorId(@PathVariable int id) {
        repository.findById(id);
    }


    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Cliente c) {
        Cliente cliente = repository.getReferenceById(id);
        cliente.setNome(c.getNome());
        cliente.setCpf(c.getCpf());
        cliente.setEmail(c.getEmail());
        cliente.setTelefone(c.getTelefone());
        repository.save(c);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable int id) {
        repository.deleteById(id);
        return "Excluído com sucesso!";
    }
}
