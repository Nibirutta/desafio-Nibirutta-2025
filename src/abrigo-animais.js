class AbrigoAnimais {
  animaisAbrigo = [
    { nome: "Rex", especie: "cão", brinquedos: ["RATO", "BOLA"]},
    { nome: "Mimi", especie: "gato", brinquedos: ["BOLA", "LASER"]},
    { nome: "Fofo", especie: "gato", brinquedos: ["BOLA", "RATO", "LASER"]},
    { nome: "Zero", especie: "gato", brinquedos: ["RATO", "BOLA"]},
    { nome: "Bola", especie: "cão", brinquedos: ["CAIXA", "NOVELO"]},
    { nome: "Bebe", especie: "cão", brinquedos: ["LASER", "RATO", "BOLA"]},
    { nome: "Loco", especie: "jabuti", brinquedos: ["SKATE", "RATO"]},
  ];

  brinquedosValidos;
  animaisValidos;

  constructor() {
    this.brinquedosValidos = new Set(this.animaisAbrigo.flatMap(animal => animal.brinquedos));
    this.animaisValidos = new Set(this.animaisAbrigo.flatMap(animal => animal.nome));
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    if (typeof brinquedosPessoa1 !== 'string' || typeof brinquedosPessoa2 !== 'string' || typeof ordemAnimais !== 'string') {
      return {
        erro: 'Valor inserido é inválido, somente string',
      };
    }    
    
    const [ listaBrinquedosPessoa1, listaBrinquedosPessoa2, animaisDesejados ] = [ brinquedosPessoa1.split(","), brinquedosPessoa2.split(","), ordemAnimais.split(',')]; // Separando os brinquedos em duas listas
    
    if (!this.verificaBrinquedos(listaBrinquedosPessoa1) || !this.verificaBrinquedos(listaBrinquedosPessoa2)) {
      return {
        erro: 'Brinquedo inválido',
      };
    }

    if (!this.verificaAnimal(animaisDesejados)) {
      return {
        erro: 'Animal inválido',
      }
    }
    
    return this.reunirCompanheiros(listaBrinquedosPessoa1, listaBrinquedosPessoa2, animaisDesejados);
  }

  verificaBrinquedos(listaBrinquedos) {
    if (listaBrinquedos.length !== new Set(listaBrinquedos).size) {
      return false;
    }

    for (const brinquedo of listaBrinquedos) {
      if (!this.brinquedosValidos.has(brinquedo.trim())) {
        return false;
      }
    }

    return true;
  }

  verificaAnimal(listaAnimais) {
    if (listaAnimais.length !== new Set(listaAnimais).size) {
      return false;
    }

    for (const animal of listaAnimais) {
      if (!this.animaisValidos.has(animal.trim())) {
        return false;
      }
    }

    return true;
  }

  possuiGato(companheiros) {
    let temGato = false;

    for (const nomes of companheiros.keys()) {
      temGato = this.animaisAbrigo.some(animalAbrigo => animalAbrigo.nome === nomes && animalAbrigo.especie === 'gato');
    }

    return temGato;
  }

  adotaPets(listaBrinquedos, possiveisCompanheiros, pessoa, animaisJaAdotados = new Map()) {
    const petsAdotados = new Map();
    let brinquedosUtilizados = new Set();
    let brinquedosGatos = new Set();

    for (const companheiro of possiveisCompanheiros) {
      if (petsAdotados.size >= 3) {
        break;
      }

      let brinquedosNecessarios = companheiro.brinquedos;
      const tentandoBrinquedos = new Set();
      let iteradorBrinquedo = 0;
      
      for (let i = 0; i < listaBrinquedos.length; i++) {
        const brinquedoNecessario = brinquedosNecessarios[iteradorBrinquedo];

        if (brinquedoNecessario === listaBrinquedos[i]) {
          if (companheiro.especie === 'gato' && !brinquedosUtilizados.has(listaBrinquedos[i])) {
            iteradorBrinquedo++;
            tentandoBrinquedos.add(listaBrinquedos[i]);
          }

          if (companheiro.especie !== 'gato') {
            if (this.possuiGato(petsAdotados)) {
              if (!brinquedosUtilizados.has(listaBrinquedos[i])) {
                iteradorBrinquedo++;
                tentandoBrinquedos.add(listaBrinquedos[i]);
              }
            } else {
              iteradorBrinquedo++;
              tentandoBrinquedos.add(listaBrinquedos[i]);
            }
          }
        }

        if (iteradorBrinquedo === brinquedosNecessarios.length) {          
          if (animaisJaAdotados.has(companheiro.nome)) {
            petsAdotados.set(companheiro.nome, `${companheiro.nome} - abrigo`);
          } else {
            petsAdotados.set(companheiro.nome, `${companheiro.nome} - pessoa ${pessoa}`);

            if (companheiro.especie === 'gato') {
              brinquedosGatos = new Set([...brinquedosGatos, ...tentandoBrinquedos]);
            }

            brinquedosUtilizados = new Set([...brinquedosUtilizados, ...tentandoBrinquedos]);
          }
        }
      }
    }

    const loco = possiveisCompanheiros.find(companheiro => companheiro.nome === 'Loco');

    if (!petsAdotados.has('Loco') && loco && petsAdotados.size > 0) {
      const locoBrinquedos = new Set(loco.brinquedos);

      const brinquedosDisponiveisLoco = new Set(listaBrinquedos.filter(
        brinquedo => !brinquedosGatos.has(brinquedo) && locoBrinquedos.has(brinquedo)
      ));

      if (brinquedosDisponiveisLoco.size === locoBrinquedos.size) {
        if (animaisJaAdotados.has(loco.nome)) {
          petsAdotados.set(loco.nome, `${loco.nome} - abrigo`);
        } else {
          petsAdotados.set(loco.nome, `${loco.nome} - pessoa ${pessoa}`);
        }
      }
    }

    return petsAdotados;
  }

  reunirCompanheiros(listaBrinquedos1, listaBrinquedos2, listaAnimais) {
    const possiveisCompanheiros = listaAnimais.map(nome => this.animaisAbrigo.find(animalAbrigo => animalAbrigo.nome === nome));
    const companheirosPessoa1 = this.adotaPets(listaBrinquedos1, possiveisCompanheiros, 1);
    const companheirosPessoa2 = this.adotaPets(listaBrinquedos2, possiveisCompanheiros, 2, companheirosPessoa1);

    const resultadoFinal = new Map(companheirosPessoa1);

    for (const [nome, resultado] of companheirosPessoa2) {
      resultadoFinal.set(nome, resultado);
    }

    possiveisCompanheiros.forEach(companheiro => {
      if (!resultadoFinal.has(companheiro.nome)) {
        resultadoFinal.set(companheiro.nome, `${companheiro.nome} - abrigo`);
      }
    });

    return {
      lista: Array.from(resultadoFinal.values()).sort()
    };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
