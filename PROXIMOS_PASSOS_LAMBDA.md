# Próximos Passos - Integração Lambda

Você já configurou a URL do Lambda nos GitHub Secrets. Agora siga estes passos para completar a integração.

---

## ✅ Já Completado

- [x] Criou a função Lambda no AWS
- [x] Habilitou Function URL (Auth = NONE)
- [x] Adicionou `LAMBDA_URL` nos GitHub Secrets

---

## 📋 Próximos Passos

### Passo 1: Atualizar o Código da Lambda no AWS (5 minutos)

1. **Acesse o AWS Console** → **Lambda**
2. Clique na função `deployment-logger`
3. Na seção **Code source**, clique em **index.mjs**
4. **Delete todo o código existente**
5. **Copie o código** do arquivo `lambda/deployment-logger.js` do seu projeto
6. **Cole no editor** do Lambda
7. Clique em **Deploy** (botão laranja no topo)
8. Aguarde a mensagem: "Successfully updated the function deployment-logger"

**Importante:** O código atualizado agora captura:
- ✅ Commit SHA (ID do commit)
- ✅ Commit Message (mensagem do commit)
- ✅ Commit Author (nome de quem fez o commit)
- ✅ Commit Author Email (email do autor)

---

### Passo 2: Fazer Deploy das Alterações no GitHub (2 minutos)

Agora você precisa fazer commit e push das alterações para o GitHub:

```bash
# Adicionar todos os arquivos modificados
git add .

# Fazer commit com mensagem descritiva
git commit -m "Enhanced Lambda logging with commit details"

# Fazer push para o GitHub (isso vai disparar o workflow)
git push origin main
```

**O que vai acontecer:**
1. GitHub Actions vai iniciar automaticamente
2. Vai buildar a imagem Docker
3. Vai fazer push para GHCR
4. Vai fazer deploy no EC2
5. Vai chamar a Lambda com os detalhes do commit ✨

---

### Passo 3: Acompanhar o Workflow no GitHub (3 minutos)

1. Vá para o seu repositório no GitHub
2. Clique na aba **Actions**
3. Você verá o workflow "Build, Push to GHCR, and Deploy to EC2" rodando
4. Clique no workflow para ver os detalhes
5. Aguarde os 3 jobs completarem:
   - ✅ **build-and-push** (constrói e envia imagem Docker)
   - ✅ **deploy-to-ec2** (faz deploy no EC2)
   - ✅ **notify-lambda** (chama a Lambda) ← **Este é o novo!**

---

### Passo 4: Verificar os Logs no CloudWatch (5 minutos)

Agora vamos ver os logs detalhados no CloudWatch:

1. **Acesse o AWS Console** → **CloudWatch**
2. No menu lateral esquerdo, clique em **Logs** → **Log groups**
3. Procure e clique em `/aws/lambda/deployment-logger`
4. Clique no **Log stream** mais recente (o que está no topo)
5. Você verá logs como este:

```
=== Deployment Event Received ===
Full Event: {
  "status": "success",
  "branch": "main",
  "commit": "abc123def456789...",
  "commit_message": "Enhanced Lambda logging with commit details",
  "commit_author": "Seu Nome",
  "commit_author_email": "seu.email@example.com",
  ...
}

--- Deployment Details ---
Status: success
Repository: username/docker-3.1
Branch: main
Commit SHA: abc123def456789...
Commit Message: Enhanced Lambda logging with commit details
Commit Author: Seu Nome <seu.email@example.com>
Triggered by: username
Workflow: Build, Push to GHCR, and Deploy to EC2
Timestamp: 2026-04-01T20:06:00Z
-------------------------
✅ DEPLOYMENT SUCCESSFUL
Application deployed successfully to EC2 from branch: main
Deployed commit: "Enhanced Lambda logging with commit details" by Seu Nome
Lambda execution completed successfully
```

**Preste atenção nestas linhas:**
- `Commit SHA:` - ID completo do commit
- `Commit Message:` - Mensagem do seu commit
- `Commit Author:` - Seu nome e email
- `Deployed commit:` - Resumo com mensagem e autor

---

### Passo 5: Tirar Screenshot para Submissão (2 minutos)

No CloudWatch, tire um screenshot que mostre claramente:

1. O nome do Log Group: `/aws/lambda/deployment-logger`
2. O timestamp do log
3. As seguintes informações no log:
   - ✅ Status (success)
   - ✅ Branch (main)
   - ✅ Commit SHA
   - ✅ **Commit Message** ← Novo!
   - ✅ **Commit Author** ← Novo!
   - ✅ Timestamp

**Dica:** Use a ferramenta de captura de tela do Windows (Win + Shift + S) para capturar a área relevante.

---

### Passo 6: Preencher o Template de Submissão (5 minutos)

Abra o arquivo `LAMBDA_SUBMISSION_TEMPLATE.md` e preencha:

1. **Seu nome** e data
2. **GitHub Repository URL**: `https://github.com/SEU_USERNAME/docker-3.1`
3. **Lambda Function URL**: Cole a URL da sua Lambda
4. **Insira o screenshot** do CloudWatch
5. **Explicação** (já tem um exemplo, você pode personalizar)

---

### Passo 7: Converter para PDF e Submeter (3 minutos)

1. Abra o `LAMBDA_SUBMISSION_TEMPLATE.md` preenchido
2. Converta para PDF:
   - **Opção 1:** Use um conversor online (markdown-to-pdf)
   - **Opção 2:** Copie o conteúdo para Word/Google Docs e exporte como PDF
   - **Opção 3:** Use VSCode com extensão "Markdown PDF"
3. Inclua o screenshot do CloudWatch no PDF
4. **Submeta o PDF** na plataforma do curso

---

## 🧪 Teste Adicional (Opcional)

Para testar novamente e ver diferentes commits nos logs:

```bash
# Faça uma pequena alteração
echo "# Test commit tracking" >> README.md

# Commit com uma mensagem diferente
git add README.md
git commit -m "Testing Lambda commit tracking feature"

# Push para disparar o workflow novamente
git push origin main
```

Depois vá no CloudWatch e veja o novo log com a mensagem "Testing Lambda commit tracking feature" e seu nome como autor!

---

## 📊 O Que Você Vai Ver no CloudWatch

Cada vez que você fizer push para o GitHub, a Lambda vai logar:

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| **Status** | success | Se o deploy funcionou ou falhou |
| **Branch** | main | Qual branch foi deployado |
| **Commit SHA** | abc123def... | ID único do commit |
| **Commit Message** | "Add new feature" | Mensagem do commit |
| **Commit Author** | João Silva | Quem fez o commit |
| **Author Email** | joao@email.com | Email do autor |
| **Triggered by** | username | Quem disparou o workflow |
| **Timestamp** | 2026-04-01T20:00:00Z | Quando aconteceu |

---

## ❓ Troubleshooting

### Problema: Lambda não está recebendo dados

**Solução:**
1. Verifique se `LAMBDA_URL` está configurado corretamente nos GitHub Secrets
2. Vá em GitHub → Settings → Secrets and variables → Actions
3. Confirme que `LAMBDA_URL` existe e está correto

### Problema: Workflow falha no step "notify-lambda"

**Solução:**
1. Vá em GitHub → Actions → Clique no workflow que falhou
2. Clique no job "notify-lambda"
3. Veja o erro do curl
4. Verifique se a Lambda Function URL está acessível (Auth = NONE)

### Problema: Não vejo logs no CloudWatch

**Solução:**
1. Aguarde 30 segundos após o workflow completar
2. Atualize a página do CloudWatch
3. Verifique se está olhando o Log Group correto: `/aws/lambda/deployment-logger`
4. Confirme que a Lambda tem permissões de CloudWatch (role `labRole`)

### Problema: Logs não mostram commit message ou author

**Solução:**
1. Verifique se você atualizou o código da Lambda no AWS (Passo 1)
2. Clique em **Deploy** após colar o novo código
3. Faça um novo push para testar

---

## 🎯 Checklist Final

Antes de submeter, confirme:

- [ ] Lambda function atualizada com o novo código
- [ ] Código deployado no AWS Lambda (botão Deploy clicado)
- [ ] Git commit e push feitos
- [ ] GitHub Actions workflow completou com sucesso (3 jobs verdes)
- [ ] CloudWatch mostra logs com commit message e author
- [ ] Screenshot capturado mostrando todos os campos
- [ ] Template de submissão preenchido
- [ ] PDF gerado com screenshot incluído
- [ ] PDF submetido na plataforma do curso

---

## 🎉 Pronto!

Após completar estes passos, você terá:

✅ Um pipeline CI/CD completo com Docker e GitHub Actions  
✅ Deploy automatizado no EC2  
✅ Monitoramento com AWS Lambda  
✅ Logs detalhados no CloudWatch com informações de commit  
✅ Audit trail completo de todos os deployments  

**Tempo total estimado:** ~25 minutos

**Boa sorte com a submissão! 🚀**
