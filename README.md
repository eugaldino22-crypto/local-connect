# Local Connect

Crie um novo aplicativo chamado:

VITRINE LOCAL

Quero construir uma plataforma moderna de marketplace local e delivery, com foco inicial em experiência mobile.

A imagem anexada nesta conversa é a PRINCIPAL REFERÊNCIA VISUAL para a experiência e o estilo do aplicativo.

IMPORTANTE:

A imagem é apenas referência de UI/UX.

NÃO copie marcas, logos, textos ou identidade visual de terceiros.

Crie uma identidade própria para o Vitrine Local.

==================================================

1. CONCEITO DO VITRINE LOCAL

==================================================

O Vitrine Local será um marketplace local onde o usuário poderá encontrar:

- restaurantes;

- lanchonetes;

- pizzarias;

- mercados;

- farmácias;

- padarias;

- lojas;

- outros estabelecimentos locais.

O objetivo é criar uma experiência semelhante a grandes aplicativos modernos de delivery, porém voltada para o comércio local.

O aplicativo deve transmitir:

- confiança;

- velocidade;

- simplicidade;

- modernidade;

- proximidade;

- qualidade;

- experiência premium.

Não quero aparência de sistema administrativo.

Quero que pareça um aplicativo comercial real pronto para ser utilizado pelos consumidores.

==================================================

2. TECNOLOGIA

==================================================

Utilize a stack padrão recomendada pelo Lovable:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui

Estruture o projeto de forma organizada e escalável.

Prepare a arquitetura para integração com Supabase posteriormente.

Não crie uma arquitetura desnecessariamente complexa.

==================================================

3. EXPERIÊNCIA MOBILE-FIRST

==================================================

A prioridade absoluta é smartphone.

A interface deve parecer um aplicativo mobile nativo.

No desktop, adapte o conteúdo para uma largura confortável, sem simplesmente esticar toda a interface.

Use:

- cards arredondados;

- sombras suaves;

- espaçamento generoso;

- imagens grandes;

- tipografia moderna;

- navegação simples;

- hierarquia visual clara;

- microinterações discretas.

Evite excesso de elementos.

==================================================

4. HOME

==================================================

A Home deve seguir aproximadamente esta estrutura:

--------------------------------

HEADER

--------------------------------

No topo:

[PIN DE LOCALIZAÇÃO]

Entregar em

[Cidade] · [UF]

[notificação]

[perfil]

A localização deve ser um elemento importante, mas visualmente discreto.

Exemplo:

📍

Entregar em

Itabaiana · SE

A cidade NÃO deve ser permanentemente hardcoded.

Preparar a interface para detectar a localização do usuário e também permitir seleção manual.

--------------------------------

SAUDAÇÃO

--------------------------------

Mostrar:

Olá 👋

O que você quer pedir hoje?

Criar uma apresentação visual forte e amigável.

--------------------------------

BUSCA

--------------------------------

Criar uma barra de pesquisa grande:

Buscar lojas, pratos ou produtos...

Com ícone de pesquisa.

A busca deve parecer um dos principais elementos da Home.

--------------------------------

CATEGORIAS

--------------------------------

Criar:

Categorias                         Ver todas

Mostrar categorias em ícones/cards circulares.

Exemplo:

🍔

Lanches

🍕

Pizza

🛒

Mercado

💊

Farmácia

🥖

Padaria

🍰

Doces

As categorias devem ser componentes reutilizáveis.

Deixar preparado para receber dados reais posteriormente.

--------------------------------

BANNER PROMOCIONAL

--------------------------------

Criar um banner horizontal grande e visualmente atraente.

Exemplo:

Descontos especiais

Promoções exclusivas perto de você

[Ver ofertas]

Utilizar imagens de alimentos/produtos.

Criar aparência premium.

Adicionar indicadores de carousel caso seja apropriado.

--------------------------------

OFERTAS PERTO DE VOCÊ

--------------------------------

Título:

Ofertas perto de você                 Ver todas

Criar cards de estabelecimentos.

Cada card deve conter:

- imagem;

- nome;

- avaliação;

- categoria;

- tempo estimado;

- taxa de entrega;

- desconto, quando houver;

- favorito.

Exemplo:

[IMAGEM]

Burger House

⭐ 4,8 · Lanches

🏍 25–35 min · R$ 5,00

Os cards devem ser visualmente semelhantes à qualidade da referência anexada, mas com design próprio do Vitrine Local.

--------------------------------

MAIS PEDIDOS

--------------------------------

Criar uma seção:

Mais pedidos                         Ver todas

Mostrar estabelecimentos/produtos populares.

Utilizar cards horizontais ou uma grade/carrossel mobile.

--------------------------------

NAVEGAÇÃO INFERIOR

--------------------------------

Criar uma bottom navigation fixa.

Itens:

Início

Buscar

Carrinho

Pedidos

Perfil

O Carrinho deve possuir maior destaque visual.

Pode utilizar um botão circular elevado no centro, inspirado na referência.

A navegação deve possuir estados ativo/inativo muito claros.

==================================================

5. TELA DE BUSCA

==================================================

Criar uma experiência de busca moderna.

Usuário poderá pesquisar:

- estabelecimentos;

- produtos;

- categorias.

Mostrar:

- campo de busca;

- filtros;

- categorias;

- resultados;

- distância;

- avaliação;

- tempo de entrega.

Preparar a estrutura para filtros como:

- Mais próximos

- Melhor avaliados

- Mais rápidos

- Menor taxa de entrega

- Ofertas

==================================================

6. TELA DO ESTABELECIMENTO

==================================================

Criar página detalhada do estabelecimento.

Estrutura:

Imagem de capa

Logo

Nome do estabelecimento

⭐ avaliação

Categoria

Tempo de entrega

Taxa de entrega

Pedido mínimo

Status aberto/fechado

Descrição

Categorias do cardápio

Produtos

Cada produto deve possuir:

- imagem;

- nome;

- descrição;

- preço;

- botão adicionar.

Criar experiência visual semelhante a aplicativos profissionais de delivery.

==================================================

7. PRODUTO

==================================================

Ao tocar em um produto, abrir uma tela/modal de detalhes.

Mostrar:

- imagem grande;

- nome;

- descrição;

- preço;

- opções;

- adicionais;

- observações;

- quantidade.

Botão:

Adicionar ao carrinho

==================================================

8. CARRINHO

==================================================

Criar carrinho moderno.

Mostrar:

- estabelecimento;

- produtos;

- quantidade;

- preço;

- adicionais;

- taxa de entrega;

- subtotal;

- total.

Botão principal:

Continuar pedido

==================================================

9. CHECKOUT

==================================================

Criar checkout preparado para:

ENDEREÇO

- endereço;

- número;

- complemento;

- referência.

ENTREGA

- entrega padrão;

- outras opções futuramente.

PAGAMENTO

Preparar arquitetura para:

- PIX;

- cartão;

- dinheiro;

- outros métodos futuramente.

Mostrar resumo do pedido.

Botão:

Finalizar pedido

==================================================

10. PEDIDOS

==================================================

Criar tela:

Meus pedidos

Separar:

Em andamento

Concluídos

Cancelados

Cada pedido deve mostrar:

- estabelecimento;

- código do pedido;

- data;

- valor;

- status.

Pedido em andamento deve possuir botão:

Acompanhar pedido

==================================================

11. ACOMPANHAMENTO

==================================================

Criar tela de acompanhamento do pedido.

Mostrar visualmente:

Pedido confirmado

↓

Preparando

↓

Saiu para entrega

↓

Entregador a caminho

↓

Entregue

Preparar espaço para mapa em tempo real futuramente.

Mostrar informações do entregador quando disponíveis.

==================================================

12. PERFIL

==================================================

Criar perfil do consumidor.

Mostrar:

- nome;

- telefone/email;

- endereços;

- métodos de pagamento;

- pedidos;

- favoritos;

- configurações.

==================================================

13. LOCALIZAÇÃO

==================================================

A localização é uma parte fundamental do Vitrine Local.

Criar arquitetura para:

1. Solicitar permissão de localização.

2. Obter latitude e longitude.

3. Encontrar a cidade mais próxima.

4. Verificar se a cidade é atendida.

5. Mostrar a cidade no topo.

6. Permitir alteração manual.

IMPORTANTE:

NÃO usar uma cidade fixa como fallback.

NÃO usar simplesmente a primeira cidade cadastrada.

NÃO assumir Maceió.

Se nenhuma cidade atendida for encontrada:

Mostrar:

"Não encontramos atendimento nesta região."

E oferecer:

[Escolher cidade]

Criar seletor de cidade.

==================================================

14. SELETOR DE CIDADE

==================================================

Ao tocar em:

Entregar em

Cidade · UF

abrir uma interface elegante.

Título:

Onde você quer receber?

Campo:

Buscar cidade...

Lista:

Cidade

UF

Exemplo:

Itabaiana

SE

Aracaju

SE

Lagarto

SE

etc.

A arquitetura deve permitir cadastrar muitas cidades futuramente.

==================================================

15. MAPA

==================================================

Preparar uma tela de mapa para o Vitrine Local.

A referência anexada mostra uma experiência de mapa com estabelecimentos próximos.

Criar estrutura para futuramente mostrar:

- localização do usuário;

- estabelecimentos;

- restaurantes;

- mercados;

- farmácias;

- lojas;

- filtros;

- cards sobre o mapa.

A interface deve ser moderna e limpa.

==================================================

16. FAVORITOS

==================================================

Permitir favoritar:

- estabelecimentos;

- produtos.

Criar ícone de coração nos cards.

==================================================

17. DESIGN

==================================================

O design deve ser:

- moderno;

- elegante;

- premium;

- minimalista;

- mobile-first;

- comercial;

- extremamente intuitivo.

Use a imagem anexada como referência de:

- proporção;

- hierarquia;

- espaçamento;

- composição;

- cards;

- navegação;

- experiência mobile.

MAS NÃO COPIE A IDENTIDADE VISUAL.

Crie uma identidade visual própria para o Vitrine Local.

Use uma paleta moderna e consistente.

Não exagerar em gradientes.

Não utilizar visual de dashboard.

==================================================

18. COMPONENTIZAÇÃO

==================================================

Criar componentes reutilizáveis.

Exemplos:

LocationHeader

CitySelector

SearchBar

CategoryCard

CategoryCarousel

PromoBanner

MerchantCard

MerchantCarousel

ProductCard

BottomNavigation

OrderStatus

MapView

EmptyState

Evitar duplicação.

==================================================

19. ESTADOS

==================================================

Criar estados de interface para:

- carregamento;

- localização carregando;

- localização autorizada;

- localização negada;

- cidade encontrada;

- cidade não encontrada;

- nenhum estabelecimento;

- nenhum produto;

- carrinho vazio;

- pedido vazio.

Não deixar telas quebradas ou vazias.

==================================================

20. DADOS

==================================================

Nesta primeira versão, pode utilizar dados de demonstração para construir a interface.

Porém:

- separar claramente dados/mock da interface;

- criar tipos TypeScript;

- preparar estrutura para substituir os mocks pelo Supabase;

- não espalhar dados falsos diretamente pelos componentes.

A arquitetura deve permitir integração posterior com banco real sem reconstruir a interface.

==================================================

21. PERFORMANCE

==================================================

Priorizar:

- carregamento rápido;

- imagens otimizadas;

- componentes leves;

- lazy loading quando apropriado;

- evitar chamadas desnecessárias;

- boa experiência em dispositivos móveis.

==================================================

22. ACESSIBILIDADE

==================================================

Garantir:

- contraste adequado;

- botões com áreas de toque confortáveis;

- labels;

- aria-labels quando necessários;

- navegação clara.

==================================================

23. RESPONSIVIDADE

==================================================

Testar visualmente em:

- iPhone;

- Android;

- tablet;

- desktop.

No mobile, a experiência deve ser prioridade.

==================================================

24. QUALIDADE FINAL

==================================================

Antes de finalizar:

- verificar todas as rotas;

- verificar navegação;

- verificar estados;

- verificar responsividade;

- verificar TypeScript;

- verificar console;

- executar build;

- corrigir erros.

Não entregar uma interface apenas "bonita".

Quero uma base funcional e organizada para transformar o Vitrine Local em um produto real.

==================================================

RESULTADO ESPERADO

==================================================

Quero que, ao abrir o Vitrine Local pela primeira vez, o usuário tenha imediatamente a sensação de estar diante de um aplicativo profissional de delivery/marketplace.

A experiência deve transmitir:

"Encontre tudo que existe perto de você."

O foco principal deve ser:

LOCALIZAÇÃO

↓

BUSCA

↓

CATEGORIAS

↓

OFERTAS

↓

ESTABELECIMENTOS

↓

PRODUTOS

↓

CARRINHO

↓

PEDIDO

Use a imagem anexada como referência visual durante toda a implementação.

Comece pela Home e pela estrutura de navegação, mas já deixe a arquitetura preparada para as demais telas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cfddba4-4138-4ca2-b0aa-01d160c7ebcd).

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
