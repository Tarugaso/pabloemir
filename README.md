# 💰 Calculadora Tarugueana

Una aplicación web moderna para dividir gastos entre amigos de manera fácil y justa. Perfecta para viajes, cenas grupales, gastos de vivienda compartida y cualquier situación donde necesites dividir cuentas.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/pabloesaire-2849s-projects/v0-divide-gastos-calculator)

## ✨ Características

- **Gestión de Participantes**: Agrega y administra amigos/participantes en el grupo de gastos
- **Registro de Gastos**: Registra gastos con descripción, monto, fecha y quién pagó
- **División Flexible**: Especifica qué participantes deben dividir cada gasto (no siempre todos)
- **Cálculo Automático**: Calcula automáticamente cuánto debe o le deben a cada persona
- **Liquidación Optimizada**: Muestra pagos sugeridos para liquidar todas las deudas con el mínimo número de transacciones
- **Interfaz Responsiva**: Funciona perfectamente en escritorio y móviles
- **Persistencia Local**: Los datos se guardan automáticamente en el navegador
- **Manejo de Errores**: Validación robusta y manejo de errores

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **JavaScript ES6+** - Lenguaje de programación moderno
- **Tailwind CSS** - Framework de estilos utilitarios
- **shadcn/ui** - Componentes de interfaz de usuario
- **localStorage** - Persistencia de datos local

## 🛠️ Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Tarugaso/pabloemir.git
cd pabloemir

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# La aplicación estará disponible en http://localhost:3000
```

### Comandos Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de la construcción
npm run test     # Ejecutar pruebas
npm run lint     # Verificar código
```

## 📖 Cómo Usar

1. **Agregar Participantes**: Comienza agregando a todas las personas que participarán en los gastos compartidos.

2. **Registrar Gastos**: Para cada gasto:
   - Describe qué se compró
   - Ingresa el monto total
   - Selecciona quién pagó
   - Marca qué participantes deben dividir este gasto

3. **Ver Liquidación**: La aplicación calculará automáticamente:
   - Cuánto debe cada persona
   - Cuánto le deben a cada persona
   - Los pagos mínimos necesarios para liquidar todas las deudas

## 🧮 Algoritmo de Cálculo

La aplicación utiliza un algoritmo de liquidación optimizado que:

1. **Calcula balances individuales**: Para cada participante, suma lo que pagó y resta lo que debe
2. **Identifica acreedores y deudores**: Separa a quienes les deben dinero de quienes deben dinero
3. **Optimiza transacciones**: Empareja acreedores con deudores para minimizar el número total de pagos
4. **Genera sugerencias**: Proporciona instrucciones claras de quién debe pagar a quién y cuánto

## 🔒 Privacidad y Datos

- **Almacenamiento Local**: Todos los datos se guardan únicamente en tu navegador
- **Sin Servidor**: No se envían datos a servidores externos
- **Control Total**: Puedes exportar, importar o eliminar tus datos en cualquier momento

## 🎨 Diseño Responsivo

La aplicación está diseñada para funcionar perfectamente en:
- 📱 Teléfonos móviles
- 📱 Tabletas
- 💻 Computadoras de escritorio
- 🖥️ Pantallas grandes

## 🧪 Pruebas

El proyecto incluye pruebas unitarias para:
- Cálculos de balances
- Algoritmos de liquidación
- Validación de datos
- Casos extremos y errores

Ejecutar pruebas:
```bash
npm run test
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes sugerencias:
- Abre un issue en GitHub
- Describe el problema con el mayor detalle posible
- Incluye pasos para reproducir el error si es aplicable

## 🎯 Casos de Uso Comunes

- **Viajes en Grupo**: Dividir gastos de hotel, comidas, transporte
- **Cenas Grupales**: Calcular cuánto debe cada persona en restaurantes
- **Vivienda Compartida**: Dividir gastos de servicios, compras del hogar
- **Eventos**: Organizar gastos de fiestas, celebraciones
- **Proyectos Grupales**: Dividir costos de materiales o servicios

---

¡Disfruta dividiendo gastos de manera justa y sin complicaciones! 🎉
