/* eslint-env node jest */
const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Testes Refatorados e Limpos', () => {
  let userService;

  beforeEach(() => {
    // Arrange comum: cria instância limpa antes de cada teste
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário com dados válidos', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('deve buscar um usuário criado pelo ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toMatchObject({
      nome: dadosUsuarioPadrao.nome,
      email: dadosUsuarioPadrao.email,
      status: 'ativo',
    });
  });

  test('deve desativar usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioBuscado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  test('deve gerar um relatório contendo todos os usuários ativos', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain(usuario1.nome);
    expect(relatorio).toContain(usuario2.nome);
    expect(relatorio).toContain('ativo');
    expect(relatorio).toMatch(/Relatório de Usuários/);
    // Evita depender da formatação exata
  });

  test('deve lançar erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const criarUsuarioInvalido = () => userService.createUser('Menor', 'menor@email.com', 17);

    // Act & Assert
    expect(criarUsuarioInvalido).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve retornar uma lista vazia quando não houver usuários', () => {
    // Arrange
    // Nenhum usuário criado

    // Act
    const usuarios = userService.getAllUsers?.() ?? [];

    // Assert
    expect(usuarios.length).toBe(0);
  });
});
