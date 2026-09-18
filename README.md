# Space Weaver

Crie uma aplicação web para construção de mapas internos em 2D e visualização em 3D, usando SVG mutável/editável.

Objetivo:

Quero um site onde eu consiga desenhar e editar plantas de ambientes, criando salas, corredores e andares. A aplicação deve permitir montar um mapa em 2D e visualizar esse mesmo mapa em 3D.

Requisitos principais:

1. Editor 2D em SVG

- Criar uma área de edição baseada em SVG.

- Permitir adicionar salas retangulares.

- Cada sala deve ter propriedades editáveis:

  - Nome da sala

  - Largura

  - Altura

  - Posição X

  - Posição Y

  - Cor

  - Tipo de ambiente

- Permitir selecionar, arrastar e redimensionar salas diretamente no editor.

- Permitir editar os valores também por um painel lateral.

- O SVG deve ser mutável, ou seja, os elementos podem ser alterados em tempo real.

- Exibir uma grade visual de apoio no fundo do editor.

- Permitir zoom e movimentação/pan no mapa 2D.

2. Visualização 3D

- Criar uma visualização 3D do mapa usando os dados do editor 2D.

- Cada sala criada em 2D deve aparecer em 3D como um bloco/extrusão.

- A altura 3D da sala deve ser configurável.

- Permitir girar, aproximar e afastar a câmera.

- O usuário deve conseguir alternar entre:

  - Modo edição 2D

  - Modo visualização 3D

- A visualização 3D deve representar paredes, pisos e volumes das salas de forma simples e clara.

3. Múltiplos andares

- A aplicação deve permitir criar dois ou mais andares.

- Cada andar deve ter seu próprio mapa 2D.

- Deve existir uma lista de andares, por exemplo:

  - Térreo

  - 1º andar

  - 2º andar

- O usuário deve conseguir:

  - Criar novo andar

  - Renomear andar

  - Excluir andar

  - Alternar entre andares

- No modo 3D, deve ser possível visualizar os andares empilhados ou selecionar apenas um andar para visualizar.

4. Sem banco de dados

- Não usar banco de dados.

- Os dados devem ser mantidos no estado da aplicação e salvos no localStorage do navegador.

- Criar botão para:

  - Salvar mapa localmente

  - Carregar mapa salvo

  - Exportar JSON

  - Importar JSON

- A estrutura JSON deve conter:

  - Lista de andares

  - Salas de cada andar

  - Dimensões, posições, cores e alturas das salas

5. Interface

- Criar uma interface moderna, limpa e responsiva.

- Layout sugerido:

  - Barra superior com nome do projeto e botões principais

  - Sidebar esquerda com ferramentas:

    - Adicionar sala

    - Selecionar

    - Mover

    - Excluir

    - Criar andar

  - Área central com o editor 2D ou visualizador 3D

  - Sidebar direita com propriedades do item selecionado

- Usar uma estética moderna, estilo dashboard/SaaS.

- O foco deve ser usabilidade, clareza e facilidade de edição.

6. Tecnologias desejadas

- React

- TypeScript

- Tailwind CSS

- SVG para o editor 2D

- Three.js ou React Three Fiber para a visualização 3D

- localStorage para salvar os dados localmente

- Não usar backend

- Não usar banco de dados

- Não usar autenticação

7. Funcionalidades extras desejáveis

- Botão para duplicar sala

- Botão para limpar andar atual

- Botão para centralizar visualização

- Identificação visual da sala selecionada

- Nome da sala visível dentro do bloco no mapa 2D

- No 3D, mostrar cada sala com altura e cor correspondente

- Exibir uma pequena legenda com o andar atual

Crie a aplicação completa, funcional e navegável.

Priorize primeiro:

1. Criar e editar salas em 2D com SVG

2. Gerenciar múltiplos andares

3. Visualizar o mapa em 3D

4. Salvar/carregar via localStorage e JSON

Não implemente banco de dados, login ou backend.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/04b9340f-abce-4a77-bc6f-90de9ee98bbd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
