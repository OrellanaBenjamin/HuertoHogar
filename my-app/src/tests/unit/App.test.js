import { validarRUN, validarNombre, validarCorreo, validarClave, validarFechaNacimiento } from './utils/validaciones';

describe('Validaciones - HuertoHogar', () => {

  describe('validarRUN', () => {
    it('debe aceptar un RUN válido', () => {
      const resultado = validarRUN('12345678-9');
      expect(resultado.ok).toBe(true);
    });

    it('debe rechazar un RUN con dígito verificador incorrecto', () => {
      const resultado = validarRUN('12345678-0');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('Dígito verificador');
    });

    it('debe rechazar un RUN incompleto', () => {
      const resultado = validarRUN('123');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('incompleto');
    });
  });

  describe('validarNombre', () => {
    it('debe aceptar nombres válidos', () => {
      const resultado = validarNombre('Juan García');
      expect(resultado.ok).toBe(true);
    });

    it('debe rechazar nombres muy cortos', () => {
      const resultado = validarNombre('J');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('muy corto');
    });

    it('debe rechazar nombres muy largos', () => {
      const resultado = validarNombre('A'.repeat(61));
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('muy largo');
    });

    it('debe rechazar nombres con números', () => {
      const resultado = validarNombre('Juan123');
      expect(resultado.ok).toBe(false);
    });
  });

  describe('validarCorreo', () => {
    it('debe aceptar correos válidos', () => {
      const resultado = validarCorreo('usuario@example.com');
      expect(resultado.ok).toBe(true);
      expect(resultado.value).toBe('usuario@example.com');
    });

    it('debe rechazar correos sin @', () => {
      const resultado = validarCorreo('usuarioexample.com');
      expect(resultado.ok).toBe(false);
    });

    it('debe rechazar correos sin dominio', () => {
      const resultado = validarCorreo('usuario@');
      expect(resultado.ok).toBe(false);
    });
  });

  describe('validarClave', () => {
    it('debe aceptar claves seguras', () => {
      const resultado = validarClave('MiClave123');
      expect(resultado.ok).toBe(true);
    });

    it('debe rechazar claves cortas', () => {
      const resultado = validarClave('Pass12');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('8 caracteres');
    });

    it('debe rechazar claves sin mayúsculas', () => {
      const resultado = validarClave('miclave123');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('mayúscula');
    });

    it('debe rechazar claves sin minúsculas', () => {
      const resultado = validarClave('MICLAVE123');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('minúscula');
    });

    it('debe rechazar claves sin números', () => {
      const resultado = validarClave('MiClaveSinNumero');
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('número');
    });
  });

  describe('validarFechaNacimiento', () => {
    it('debe aceptar alguien mayor de 18 años', () => {
      const hace20Años = new Date();
      hace20Años.setFullYear(hace20Años.getFullYear() - 20);
      const fechaStr = hace20Años.toISOString().split('T')[0];
      const resultado = validarFechaNacimiento(fechaStr);
      expect(resultado.ok).toBe(true);
    });

    it('debe rechazar a alguien menor de 18 años', () => {
      const hace16Años = new Date();
      hace16Años.setFullYear(hace16Años.getFullYear() - 16);
      const fechaStr = hace16Años.toISOString().split('T')[0];
      const resultado = validarFechaNacimiento(fechaStr);
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('18');
    });

    it('debe rechazar fechas futuras', () => {
      const futuro = new Date();
      futuro.setFullYear(futuro.getFullYear() + 1);
      const fechaStr = futuro.toISOString().split('T')[0];
      const resultado = validarFechaNacimiento(fechaStr);
      expect(resultado.ok).toBe(false);
      expect(resultado.message).toContain('futura');
    });
  });

});

describe('Carrito - Funcionalidad', () => {

  it('debe calcular subtotal correctamente', () => {
    const carrito = [
      { id: 'FR001', qty: 2 },
      { id: 'FR002', qty: 3 }
    ];
    const productos = [
      { id: 'FR001', precio: 1200 },
      { id: 'FR002', precio: 1000 }
    ];
    const subtotal = carrito.reduce((acc, item) => {
      const prod = productos.find(p => p.id === item.id);
      return acc + (prod.precio * item.qty);
    }, 0);
    expect(subtotal).toBe(2400 + 3000);
    expect(subtotal).toBe(5400);
  });

  it('debe aplicar descuentos correctamente', () => {
    const subtotal = 1000;
    const VERDE10 = 0.10;
    const descuento = subtotal * VERDE10;
    const total = subtotal - descuento;
    expect(descuento).toBe(100);
    expect(total).toBe(900);
  });

  it('debe aplicar múltiples descuentos correctamente', () => {
    const subtotal = 10000;
    const CAMPO15 = 0.15;
    const descuento = subtotal * CAMPO15;
    const total = subtotal - descuento;
    expect(descuento).toBe(1500);
    expect(total).toBe(8500);
  });

});

describe('Productos - Filtrado y Búsqueda', () => {

    it('debe filtrar productos por categoría', () => {
    const productos = [
      { id: 'FR001', name: 'Manzanas', category: 'Frutas Frescas' },
      { id: 'VR001', name: 'Zanahorias', category: 'Verduras Orgánicas' },
      { id: 'FR002', name: 'Naranjas', category: 'Frutas Frescas' }
    ];
    const filtrados = productos.filter(p => p.category === 'Frutas Frescas');
    expect(filtrados.length).toBe(2);
    expect(filtrados.id).toBe('FR001');
  });
});
