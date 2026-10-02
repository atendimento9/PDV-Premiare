# Checklist de publicação na Vercel

O site está hospedado na Vercel. As instruções de build e deploy ficam em
`VERCEL_DEPLOYMENT.md`.

## Bloqueia a publicação

- [x] **Testados os três links de WhatsApp.** Números completados com o DDI 55
      (ver DECISIONS 26) — Weliton, Rafael e Caio confirmados abrindo a
      conversa certa.
- [ ] **Domínio definitivo** no build:
      `SITE_URL=https://www.seudominio.com.br npm run build`.
      Sem isso, canonical, Open Graph e sitemap saem com
      `dominio-a-definir.invalid`.
- [x] **Nenhum bloco `PENDENTE-CLIENTE` restante.** Canais de atendimento, dados
      cadastrais e a página de privacidade estão completos.
- [ ] **Conferir a privacidade depois de publicar na Vercel.** A página afirma que
      o site não grava cookies nem carrega script de terceiro — verdade sobre os
      arquivos de `dist/`. Se a hospedagem injetar analytics ou cookie próprio,
      a afirmação deixa de ser verdadeira e a página precisa mudar junto
      (ver DECISIONS 30).

## Decisões que cabem à Premiare

- [ ] **Logotipos de clientes no carrossel do hero.** Os 14 vieram da seção
      "Atendemos quem exige o melhor" do site oficial da Premiare — ou seja, a
      própria empresa já os publica. Ainda assim, republicá-los aqui repete uma
      afirmação de relacionamento comercial: confirme que a autorização de uso
      de marca de cada cliente segue válida para este site. Lista em
      `../src/content/clients.ts`.

- [x] **Curadoria dos 65 itens concluída.** Critérios, SKUs e fichas oficiais
      estão registrados em `CURADORIA_2026-10-02.md`.
- [x] **Parceria Astor registrada.** O cliente informou em 02/10/2026 que a
      Premiare está autorizada a vender os produtos Astor no próprio site; o
      escopo declarado está anotado em `RIGHTS_CLEARANCE.md`.
- [ ] **Conferir as quatro imagens editadas para esta seleção.** Exemplos,
      fontes e descrições das edições estão em `CURADORIA_2026-10-02.md`.
- [ ] **Confirmar prazo de produção e personalização no orçamento.** As fichas
      não prometem prazo de entrega.
- [x] **Limites de tamanho:** 20 MB por build e 3 MB por arquivo são limites
      internos de qualidade, conferidos pelo gate `check-budget`; não são limites
      da Vercel.
- [ ] **Vídeo do hero é upscale, não resolução nativa.** A fonte é 1280×720; o
      arquivo publicado (1920×720) foi ampliado por interpolação Lanczos a
      pedido, como medida provisória. Quando houver um vídeo de origem nativo
      em resolução maior, substituir e reprocessar sem upscale — ver
      `HERO_VIDEO.md`, seção "Upscale para 1080p-equivalente".
- [ ] **Redes sociais** (`instagram`, `linkedin` em `site.ts`): vazias, e por
      isso não há links sociais no rodapé.

## Antes de subir

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Definir `SITE_URL` nas variáveis de ambiente da Vercel e gerar o build
- [ ] `npm run gates` (validate-catalog · check-forbidden · check-budget · check-links)
- [ ] `node scripts/audit-static.mjs`
- [ ] `node scripts/serve-dist.mjs` e conferir home, um produto e o catálogo
- [ ] Conferir o tamanho de `dist/` com `npm run check-budget`

## Depois de subir

- [ ] `/` abre; uma página de produto abre direto pela URL
- [ ] `sitemap.xml` e `robots.txt` respondem, com o domínio certo
- [ ] Enviar o sitemap ao Search Console
- [ ] Conferir a rota 404 no domínio Vercel
- [ ] Testar um CTA de orçamento de ponta a ponta, com o número real
- [ ] Conferir o site num celular de verdade

## O que é esperado e não deve ser "corrigido"

- **Search Console vai apontar "campo ausente: offers" nos `Product`.** É
  intencional: este site não tem preço.
- **As duas páginas legais estão com `noindex`.** Sai depois da revisão jurídica.
- **Não há banner de cookies.** O site não instala cookie, armazenamento local
  nem rastreador — pedir consentimento para algo que não acontece seria ruído. Se
  algum dia entrar uma ferramenta de medição, a política precisa ser atualizada e
  o consentimento implementado **antes** da coleta.
- **Fichas técnicas têm tamanhos diferentes.** Campo ausente não vira linha; é o
  comportamento correto, não falta de padronização.

## Quando os dados de origem mudarem

```bash
npm run import-catalog      # importa planilha, prepara fotos e aplica curadoria
npm run retire-unselected-images
npm run build && npm run gates
```

Se a contagem divergir de 65 / 7 / 10 / 5, `validate-catalog` **falha o build e
mostra os números reais**. O certo nesse caso é investigar a planilha — nunca
ajustar o dado para o gate passar.
