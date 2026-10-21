const { validateCreateTask, parseTaskId } = require('../src/validation');

describe('validateCreateTask', () => {
  test('acepta un title válido y pone done en false por defecto', () => {
    expect(validateCreateTask({ title: 'Comprar pan' })).toEqual({
      value: { title: 'Comprar pan', done: false },
    });
  });

  test('respeta done explícito', () => {
    expect(validateCreateTask({ title: 'x', done: true })).toEqual({
      value: { title: 'x', done: true },
    });
  });

  test('recorta el title', () => {
    expect(validateCreateTask({ title: '  Leer  ' })).toEqual({
      value: { title: 'Leer', done: false },
    });
  });

  test('acepta un title de exactamente 100 caracteres', () => {
    const title = 'a'.repeat(100);
    expect(validateCreateTask({ title })).toEqual({ value: { title, done: false } });
  });

  test('acepta 100 caracteres tras recortar espacios', () => {
    const title = 'a'.repeat(100);
    expect(validateCreateTask({ title: `  ${title}  ` })).toEqual({ value: { title, done: false } });
  });

  test('rechaza un title de 101 caracteres', () => {
    expect(validateCreateTask({ title: 'a'.repeat(101) })).toEqual({
      error: 'title must be at most 100 characters',
    });
  });

  test('rechaza title ausente', () => {
    expect(validateCreateTask({ done: true })).toEqual({ error: 'title is required' });
  });

  test('sin cuerpo o con cuerpo vacío exige title', () => {
    expect(validateCreateTask(undefined)).toEqual({ error: 'title is required' });
    expect(validateCreateTask({})).toEqual({ error: 'title is required' });
  });

  test('rechaza title que no es string', () => {
    expect(validateCreateTask({ title: 42 })).toEqual({ error: 'title must be a string' });
    expect(validateCreateTask({ title: null })).toEqual({ error: 'title must be a string' });
  });

  test('rechaza title vacío tras recortar', () => {
    expect(validateCreateTask({ title: '   ' })).toEqual({ error: 'title must not be empty' });
    expect(validateCreateTask({ title: '' })).toEqual({ error: 'title must not be empty' });
  });

  test('rechaza done no booleano', () => {
    expect(validateCreateTask({ title: 'x', done: 'yes' })).toEqual({ error: 'done must be a boolean' });
    expect(validateCreateTask({ title: 'x', done: null })).toEqual({ error: 'done must be a boolean' });
  });

  test('rechaza un campo desconocido nombrando el primero', () => {
    expect(validateCreateTask({ title: 'x', priority: 1, owner: 'a' })).toEqual({
      error: 'unknown field: priority',
    });
  });

  test('rechaza un cuerpo que no es objeto', () => {
    const error = { error: 'request body must be a JSON object' };
    expect(validateCreateTask([])).toEqual(error);
    expect(validateCreateTask(null)).toEqual(error);
    expect(validateCreateTask('texto')).toEqual(error);
  });

  test('respeta el orden de validación de FR1.10', () => {
    // Campo desconocido antes que title inválido.
    expect(validateCreateTask({ title: 42, extra: true })).toEqual({ error: 'unknown field: extra' });
    // title antes que done.
    expect(validateCreateTask({ title: '', done: 'no' })).toEqual({ error: 'title must not be empty' });
    // Forma del cuerpo antes que todo.
    expect(validateCreateTask([{ extra: 1 }])).toEqual({ error: 'request body must be a JSON object' });
  });
});

describe('parseTaskId', () => {
  test('convierte un id válido en entero', () => {
    expect(parseTaskId('1')).toBe(1);
    expect(parseTaskId('42')).toBe(42);
    expect(parseTaskId('10')).toBe(10);
  });

  test.each(['abc', '0', '-1', '1.5', '1.0', '01', '+1', '', ' 1', '1e3'])(
    'devuelve null para "%s"',
    (param) => {
      expect(parseTaskId(param)).toBeNull();
    },
  );
});
