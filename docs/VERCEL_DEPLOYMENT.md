# Publicação na Vercel

O site usa Astro em modo estático. A Vercel oferece suporte ao build estático de
Astro sem adapter; o projeto já gera o conteúdo publicado em `dist/`.

## Integração com o GitHub

O repositório GitHub é `atendimento9/PDV-Premiare`, e a branch local `main`
acompanha `origin/main`. A Vercel usa `main` como branch de produção por padrão,
mas a configuração do projeto pode ser diferente. Confira em **Project Settings
→ Environments**. Com a integração Git ativa, cada push cria um deployment;
pushes na branch de produção atualizam Production e outras branches geram Preview
Deployments.

Configuração de build esperada no projeto Vercel:

| Campo | Valor |
|---|---|
| Framework preset | Astro |
| Install command | `npm install` (ou o padrão detectado pela Vercel) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | raiz deste repositório |

Não instale `@astrojs/vercel` para esta configuração estática. O adapter é
necessário para recursos de runtime da Vercel, como SSR ou Image Optimization;
este site entrega HTML, CSS, JavaScript e mídia estáticos.

## Domínio e metadados

O deployment atual usa `https://catalogo-premiare-criativa.vercel.app` como
origem canônica. Após o push da curadoria, conferi que `sitemap.xml` responde
com esse domínio. Se a Premiare configurar um domínio próprio na Vercel, atualize
`SITE_URL` para ele nas variáveis de ambiente do projeto e gere outro deployment.

Sem `SITE_URL`, o build local usa `https://dominio-a-definir.invalid` em
canonical, Open Graph e sitemap. Configure a variável local antes de gerar um
build destinado a publicação manual. Depois do deployment, abra `sitemap.xml` e
confira os metadados de uma página de produto.

Build local com domínio definido:

```bash
SITE_URL=https://www.seudominio.com.br npm run build
```

No PowerShell:

```powershell
$env:SITE_URL = "https://www.seudominio.com.br"
npm run build
```

## Revisão antes do push de produção

```bash
npm run lint
npm run typecheck
npm run build
npm run gates
node scripts/audit-static.mjs
```

Para visualizar exatamente os arquivos estáticos gerados:

```bash
node scripts/serve-dist.mjs 4399
```

Abra `http://localhost:4399` e confira a home, o catálogo, uma página de
produto, uma solução e o contato.

## Depois do deployment

- Confirme no painel que o deployment terminou com status Ready.
- Abra a home, uma URL direta de produto e uma rota de solução.
- Confira `robots.txt`, `sitemap.xml`, canonical e Open Graph com o domínio certo.
- Teste um CTA de orçamento e valide a página em celular.
- Confirme que a política de privacidade corresponde aos scripts e cookies
  efetivamente incluídos no ambiente publicado.
- Envie o sitemap ao Google Search Console, se aplicável.

Os limites de 20 MB para o build e 3 MB por arquivo são limites internos de
qualidade do projeto, não limites da Vercel. Eles são verificados por
`scripts/check-budget.mjs`.

## Fontes oficiais

- [Astro na Vercel](https://vercel.com/docs/frameworks/frontend/astro)
- [Deploy de repositórios Git](https://vercel.com/docs/git)
- [Ambientes de deployment](https://vercel.com/docs/deployments/environments)
