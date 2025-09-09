import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {
  test('Deve rejeitar valor de tipo inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(3, 'BOLA,LASER', 'Loco');
    expect(resultado.erro).toBe('Valor inserido é inválido, somente string');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar brinquedo inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER', 'OSSO,LASER', 'Rex,Fofo');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para o loco compartilhando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'CAIXA,RATO,SKATE,NOVELO', 'Zero,Bola,Loco,Rex');

    expect(resultado.lista[0]).toBe('Bola - pessoa 2');
    expect(resultado.lista[1]).toBe('Loco - pessoa 2');
    expect(resultado.lista[2]).toBe('Rex - abrigo');
    expect(resultado.lista[3]).toBe('Zero - pessoa 1');
    expect(resultado.lista.length).toBe(4);
    expect(resultado.erro).toBeFalsy();
  })
});
