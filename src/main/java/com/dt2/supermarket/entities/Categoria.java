package com.dt2.supermarket.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank
    private String nome;
    @NotBlank
    private String descricao;
    @NotBlank
    private String departamento;

    public Categoria(int id, String nome, String descricao, String departamento) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.departamento = departamento;
    }

    public Categoria(String nome, String descricao, String departamento) {
        this.nome = nome;
        this.descricao = descricao;
        this.departamento = departamento;
    }

    public Categoria() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }
}
