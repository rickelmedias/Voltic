package br.com.voltic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@EnableRetry
@SpringBootApplication
public class VolticApplication {

	public static void main(String[] args) {
		SpringApplication.run(VolticApplication.class, args);
	}

}
