class AbrigoAnimais {
  // Dados mocados - muito útil para simular uma especie de banco de dados que pode ser utilizado pela aplicação
  animaisAbrigo = [
    { nome: "Rex", especie: "cão", brinquedos: ["RATO", "BOLA"]},
    { nome: "Mimi", especie: "gato", brinquedos: ["BOLA", "LASER"]},
    { nome: "Fofo", especie: "gato", brinquedos: ["BOLA", "RATO", "LASER"]},
    { nome: "Zero", especie: "gato", brinquedos: ["RATO", "BOLA"]},
    { nome: "Bola", especie: "cão", brinquedos: ["CAIXA", "NOVELO"]},
    { nome: "Bebe", especie: "cão", brinquedos: ["LASER", "RATO", "BOLA"]},
    { nome: "Loco", especie: "jabuti", brinquedos: ["SKATE", "RATO"]},
  ];

  // Variaveis para validação
  brinquedosValidos;
  animaisValidos;

  // Fazendo uso do constructor para capturar os dados necessários ao instanciar a classe para validação
  // Além disso, eu optei por fazer uso do set para evitar repetição e pela facilidade de acesso
  constructor() {
    this.brinquedosValidos = new Set(this.animaisAbrigo.flatMap(animal => animal.brinquedos));
    this.animaisValidos = new Set(this.animaisAbrigo.flatMap(animal => animal.nome));
  }

  // Método principal
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Aqui eu realizei uma validação de tipo para impedir o fluxo caso tenha algum dado que não seja string
    if (
      typeof brinquedosPessoa1 !== 'string'
      || typeof brinquedosPessoa2 !== 'string'
      || typeof ordemAnimais !== 'string'
    ) {
      return {
        erro: 'Valor inserido é inválido, somente string',
      };
    }    
    
    // Aqui eu fiz a organização de dados em arrays
    // Graças ao split, eu fui capaz de separar cada elemento pela vírgula, armazenando-os em um array
    const [ 
      listaBrinquedosPessoa1,
      listaBrinquedosPessoa2,
      animaisDesejados
    ] = [ 
      brinquedosPessoa1.split(","),
      brinquedosPessoa2.split(","),
      ordemAnimais.split(',')
    ];
    
    // Validando a lista de brinquedos
    if (
      !this.verificaBrinquedos(listaBrinquedosPessoa1)
      || !this.verificaBrinquedos(listaBrinquedosPessoa2)
    ) {
      return {
        erro: 'Brinquedo inválido',
      };
    }

    // Validando os pets
    if (!this.verificaAnimal(animaisDesejados)) {
      return {
        erro: 'Animal inválido',
      }
    }
    
    // Função que reune os donos com os seus pets
    return this.reunirCompanheiros(listaBrinquedosPessoa1, listaBrinquedosPessoa2, animaisDesejados);
  }

  verificaBrinquedos(listaBrinquedos) {

    // Verificando se há duplicatas, logo, se o tamanho do set for diferente, então haverá duplicatas
    if (listaBrinquedos.length !== new Set(listaBrinquedos).size) {
      return false;
    }

    // Verificando se o brinquedo presente na lista esta nos dados
    // Sets são extremamente úteis para busca, pois permite uma abordagem mais direta, graças ao método has()
    for (const brinquedo of listaBrinquedos) {
      if (!this.brinquedosValidos.has(brinquedo)) {
        return false;
      }
    }

    // Se tudo ocorrer bem até aqui, os brinquedos são todos válidos
    return true;
  }

  verificaAnimal(listaAnimais) {

    // Verificando se há duplicatas, logo, se o tamanho do set for diferente, então haverá duplicatas
    if (listaAnimais.length !== new Set(listaAnimais).size) {
      return false;
    }

    // Verificando se o animal presente na lista esta nos dados
    // Sets são extremamente úteis para busca, pois permite uma abordagem mais direta, graças ao método has()
    for (const animal of listaAnimais) {
      if (!this.animaisValidos.has(animal.trim())) {
        return false;
      }
    }
    
    // Se tudo ocorrer bem até aqui, os animais são todos válidos
    return true;
  }

  // Método para averiguar se, dentre os companheiros na lista, há algum gato
  possuiGato(companheiros) {
    let temGato = false;

    // Acessando cada pet presente dentre os companheiros com o loop for
    // O método some() é muito útil caso você queira realizar uma verificação dentro de um array
    // Caso haja um gato será retornado true e esse retorno será armazenado na variavel temGato
    for (const nomes of companheiros.keys()) {
      temGato = this.animaisAbrigo
        .some(
          animalAbrigo => animalAbrigo.nome === nomes && animalAbrigo.especie === 'gato'
        );
    }

    return temGato;
  }

  // Método para verificar a compatibilidade entre os pets e os brinquedos
  adotaPets(listaBrinquedos, possiveisCompanheiros, pessoa, animaisJaAdotados = new Map()) {

    // Aqui armazeno todos os pets passiveis de adoção
    const petsAdotados = new Map();

    // Aqui armazendo todos os brinquedos dos pets adotados
    let brinquedosUtilizados = new Set();

    // Aqui armazeno somente os brinquedos dos gatos adotados
    let brinquedosGatos = new Set();

    for (const companheiro of possiveisCompanheiros) {

      // Não pode adotar mais de 3, saindo do loop com o break
      if (petsAdotados.size >= 3) {
        break;
      }

      let brinquedosNecessarios = companheiro.brinquedos;

      // Set temporario para armazenar os brinquedos utilizados pelo pet na verificação
      const tentandoBrinquedos = new Set();

      // Mais a frente ele será utilizado para verificar a compatibilidade
      let iteradorBrinquedo = 0;
      
      for (let i = 0; i < listaBrinquedos.length; i++) {

        // Captura brinquedo de acordo com a posição - começa sempre no inicio e termina no final da lista
        const brinquedoNecessario = brinquedosNecessarios[iteradorBrinquedo];

        // Se brinquedo for compativel, entramos na lógica de adoção
        if (brinquedoNecessario === listaBrinquedos[i]) {

          // Caso companheiro seja um gato, deve averiguar antes se o seu brinquedo já foi utilizado
          if (companheiro.especie === 'gato' && !brinquedosUtilizados.has(listaBrinquedos[i])) {
            iteradorBrinquedo++;
          }

          // Se não for um gato, ainda assim deve averiguar se já foi adotado um gato
          // Pois o brinquedo pode estar em uso por ele
          if (companheiro.especie !== 'gato') {
            if (this.possuiGato(petsAdotados)) {
              if (!brinquedosUtilizados.has(listaBrinquedos[i])) {
                iteradorBrinquedo++;
              }
            } else {
              iteradorBrinquedo++;
            }
          }

          tentandoBrinquedos.add(listaBrinquedos[i]);
        }

        // Caso a quantidade de brinquedos do iterador seja igual a quantidade requerida pelo animal
        // Ele será passível de adoção
        if (iteradorBrinquedo === brinquedosNecessarios.length) {
          
          // Caso o animal já tenha sido considerado passivel de adoção por outra pessoa, 
          // Ele ficará no abrigo - (faz isso não! T_T)
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

    // Lógica especial para o loco
    // Caso ele esteja presente e não tenha sido adotado anteriormente, 
    // Ele poderá entrar nessa regra especial se ele tiver um amigo pet
    if (!petsAdotados.has('Loco') && loco && petsAdotados.size > 0 && petsAdotados.size < 3) {
      const locoBrinquedos = new Set(loco.brinquedos);

      // Mas como os gatos são exigentes, eles não compartilham brinquedos, nem com o loco
      // Por isso devemos verificar se os brinquedos dele estão disponiveis, filtrando o array
      const brinquedosDisponiveisLoco = new Set(listaBrinquedos.filter(
        brinquedo => !brinquedosGatos.has(brinquedo) && locoBrinquedos.has(brinquedo)
      ));

      // Caso o loco já tenha sido considerado passivel de adoção por outra pessoa, 
      // Ele ficará no abrigo - (de novo isso! T_T)
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

  // Orquestrando o fluxo nessa função
  reunirCompanheiros(listaBrinquedos1, listaBrinquedos2, listaAnimais) {
    // Filtra os companheiros
    const possiveisCompanheiros = listaAnimais.map(nome => this.animaisAbrigo.find(animalAbrigo => animalAbrigo.nome === nome));

    const companheirosPessoa1 = this.adotaPets(listaBrinquedos1, possiveisCompanheiros, 1);
    const companheirosPessoa2 = this.adotaPets(listaBrinquedos2, possiveisCompanheiros, 2, companheirosPessoa1);

    // Armazena o primeiro resultado para depois combinar com o segundo resultado,
    // Inclusive, impedindo duplicação de adoção 
    const resultadoFinal = new Map(companheirosPessoa1);

    for (const [nome, resultado] of companheirosPessoa2) {
      resultadoFinal.set(nome, resultado);
    }

    // Captura aqueles animais que não foram compativeis e armazena no resultado final
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
