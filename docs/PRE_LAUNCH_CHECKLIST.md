# Checklist de pré-lançamento

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
- [ ] **Conferir a privacidade depois de publicar na Wix.** A página afirma que
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

- [ ] **Conferir as 13 imagens editadas do catálogo.** As dez fotos com marcas
      visíveis foram substituídas por versões genéricas, e os três produtos antes
      sem foto receberam imagens derivadas de referências dos SKUs exatos no site
      do fornecedor. Ver `IMAGE_UPDATES_2026-10-02.md`.
- [ ] **Confirmar autorização para as três referências adicionais do fornecedor.**
      A autorização registrada em `RIGHTS_CLEARANCE.md` cobria apenas imagens da
      planilha; a busca e a inclusão dessas três imagens foram solicitadas depois.
- [ ] **Prazo de produção só existe para 1 dos 40 produtos.** Nenhuma parte do
      site promete prazo. Se a Premiare tiver essa informação, ela cabe na
      planilha e passa a aparecer nas fichas automaticamente.
- [ ] **Limites de tamanho da Wix**: confirmar com o suporte os valores oficiais
      para upload de site estático. Os gates usam 20 MB no total e 3 MB por
      arquivo, valores de referência do briefing. O build atualizado tem
      7,35 MB e maior arquivo de 1,33 MB (o vídeo do hero). Os limites ainda
      não foram confirmados pela Wix. Ver `HERO_VIDEO.md` §9
      para as alternativas caso um dia o vídeo cresça.
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
- [ ] `SITE_URL=… npm run build`
- [ ] `npm run gates` (validate-catalog · check-forbidden · check-budget · check-links)
- [ ] `node scripts/audit-static.mjs`
- [ ] `node scripts/serve-dist.mjs` e conferir home, um produto e o catálogo
- [ ] Conferir o tamanho de `dist/` contra o limite confirmado da Wix

## Depois de subir

- [ ] `/` abre; uma página de produto abre direto pela URL
- [ ] `sitemap.xml` e `robots.txt` respondem, com o domínio certo
- [ ] Enviar o sitemap ao Search Console
- [ ] Página de erro do domínio apontando para `404.html`
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

## Quando a planilha mudar

```bash
npm run import-catalog     # relê a planilha, regenera os JSONs
npm run optimize-images    # baixa/otimiza as fotos novas
npm run build && npm run gates
```

Se a contagem divergir de 40 / 9 / 10 / 5, `validate-catalog` **falha o build e
mostra os números reais**. O certo nesse caso é investigar a planilha — nunca
ajustar o dado para o gate passar.
