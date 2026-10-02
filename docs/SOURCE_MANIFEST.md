# Manifesto de fontes

Arquivos de entrada usados neste projeto, com hash para rastreabilidade.
Nenhum deles foi alterado. A planilha em particular é aberta somente em leitura.

| Arquivo | Papel | SHA-256 |
|---|---|---|
| `relatorio_premiare_astor (2).xlsx` | Fonte única e obrigatória do catálogo | `f26a2aecb6726bb3797cd70147434a82882a9bac0054edceff85bb51c5f16303` |
| `LOGO COLORIDA-8.svg` | Logotipo oficial | `020c7f9d5dc541556419b80a1f8098ea9bd731c31b701a8c144bfe31a16c509c` |

## Logotipo

Copiado byte a byte para `public/brand/premiare-logo.svg`. O hash do arquivo
publicado é **idêntico** ao da origem — prova de que não houve redesenho,
recorte, recoloração, alteração de proporção nem remoção da faixa amarela.

## Tipografia

Inter, auto-hospedada em `public/fonts/`. Baixada uma única vez em 31/08/2026 e
versionada no repositório; o site publicado não faz nenhuma requisição a
servidor de fontes.

| Arquivo | Subconjunto | SHA-256 |
|---|---|---|
| `inter-latin.woff2` | latin | `3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62` |
| `inter-latin-ext.woff2` | latin-ext | `34b9c504cab7a73e37b746343a449132e56cf7b5481af2cb81dc74dcff25c956` |

Ambos são arquivos de fonte variável (peso 100–900), o que cobre todos os pesos
usados no site com dois arquivos.

## Localização da planilha pelo importador

`scripts/import-catalog.py` procura por `relatorio_premiare_astor*.xlsx`, nesta
ordem: `$PREMIARE_XLSX_DIR`, `./source/`, `~/Downloads/`. Havendo mais de uma
versão, vence o maior sufixo numérico entre parênteses — desempate estável, para
que o mesmo conjunto de arquivos gere sempre o mesmo build. Arquivos temporários
do Excel (`~$…`) são ignorados.

Se nenhuma planilha for encontrada, o importador **para com erro** em vez de
gerar um catálogo vazio.

## Vídeo do hero

| Arquivo | Papel | SHA-256 |
|---|---|---|
| `Anime_esta_imagem_mantendo_EXA.mp4` | Material aprovado do hero (preservado, não substituído) | `fdc0d564bf7ecc313ffd6b41860b8ae53ad377617071d90c8e037b6aec8de9dd` |
| `PREMIARE.svg` | Versão negativa oficial da marca | `29beb80928d2f1aab31f8b94c38bfc85b3b4ad545d275450e155fa78180b78b1` |

Derivados publicados (recorte da faixa de ondas, sem áudio, com faststart):

| Arquivo | SHA-256 |
|---|---|
| `public/video/hero-premiare-desktop.mp4` | `2177a543689625efbd7a4bbd592130f187f7cabb1efecc86496fe4242c9b8ec0` |
| `public/video/hero-premiare-mobile.mp4` | `2324e6b55f70dbd8891219ec93ec407a151d75856f506be8c82edd79bc080b15` |
| `public/video/hero-premiare-poster.webp` | `eb5642b140120eafe5b3c7a7db5b33cf77f409895fe0c0cd4719f0169e382400` |
| `public/video/hero-premiare-poster-mobile.webp` | `83155507c53ce82778bab0d99cbf1ca11c916d2363c465e2efaa9965164b9438` |
| `public/brand/premiare-logo-negativa.svg` | `8288348b7a2df3686bab2f372c2f13b79c04792e0473480787fa92a701e9b78b` |

Ferramenta: ffmpeg 7.1 (binário do pacote `imageio-ffmpeg`). Comandos completos
em `HERO_VIDEO.md`.

## Logotipos de clientes

14 arquivos em `public/clients/` (76 KB no total), baixados da seção "Atendemos
quem exige o melhor" do **site oficial da Premiare Criativa**
(www.premiarecriativa.com.br), consultado em 01/09/2026. Aparados e reamostrados
para altura ótica comum, sempre com a proporção original. Nenhum foi recolorido,
esticado ou cortado no conteúdo. Lista e proveniência em `src/content/clients.ts`.
