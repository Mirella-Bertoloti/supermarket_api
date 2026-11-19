package com.dt2.supermarket.repository;

import com.dt2.supermarket.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}
