#!/bin/bash
set -e

# Cors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
RG="voltic-app-$(date +%s)"
LOCATION="eastus"
ACR_NAME="volticacr$(date +%s)"

echo -e "${BLUE}🚀 Iniciando deploy na Azure...${NC}"

# Verificar se Azure CLI está instalado
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI não encontrado. Instale com:${NC}"
    echo "curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
    exit 1
fi

# Login no Azure
echo -e "${YELLOW}🔐 Fazendo login no Azure...${NC}"
az login

# Criar resource group
echo -e "${YELLOW}📁 Criando resource group: $RG${NC}"
az group create --name $RG --location $LOCATION

# Criar container registry
echo -e "${YELLOW}🏗️ Criando container registry: $ACR_NAME${NC}"
az acr create --resource-group $RG --name $ACR_NAME --sku Basic --admin-enabled true

# Login no registry
echo -e "${YELLOW}🔑 Fazendo login no container registry...${NC}"
az acr login --name $ACR_NAME

# Build das imagens
echo -e "${YELLOW}🔨 Fazendo build das imagens...${NC}"
docker build -t voltic-backend ./Backend
docker build -t voltic-frontend ./Frontend

# Tag das imagens
echo -e "${YELLOW}🏷️ Marcando imagens...${NC}"
docker tag voltic-backend $ACR_NAME.azurecr.io/backend:latest
docker tag voltic-frontend $ACR_NAME.azurecr.io/frontend:latest

# Push das imagens
echo -e "${YELLOW}📤 Enviando imagens para registry...${NC}"
docker push $ACR_NAME.azurecr.io/backend:latest
docker push $ACR_NAME.azurecr.io/frontend:latest

# Obter credenciais do registry
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Deploy backend
echo -e "${YELLOW}📦 Deployando backend...${NC}"
BACKEND_DNS="voltic-api-$(date +%s)"
az container create \
  --resource-group $RG \
  --name backend \
  --image $ACR_NAME.azurecr.io/backend:latest \
  --registry-login-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_NAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label $BACKEND_DNS \
  --ports 8080 \
  --cpu 1 --memory 2 \
  --restart-policy Always

# Aguardar backend estar pronto
echo -e "${YELLOW}⏳ Aguardando backend ficar pronto...${NC}"
sleep 30

# Obter URL do backend
BACKEND_URL=$(az container show --resource-group $RG --name backend --query ipAddress.fqdn -o tsv)
echo -e "${GREEN}✅ Backend disponível em: http://$BACKEND_URL:8080${NC}"

# Deploy frontend
echo -e "${YELLOW}🎨 Deployando frontend...${NC}"
FRONTEND_DNS="voltic-app-$(date +%s)"
az container create \
  --resource-group $RG \
  --name frontend \
  --image $ACR_NAME.azurecr.io/frontend:latest \
  --registry-login-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_NAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label $FRONTEND_DNS \
  --ports 3000 \
  --cpu 1 --memory 1.5 \
  --restart-policy Always \
  --environment-variables NEXT_PUBLIC_API_URL=http://$BACKEND_URL:8080

# Aguardar frontend estar pronto
echo -e "${YELLOW}⏳ Aguardando frontend ficar pronto...${NC}"
sleep 30

# URLs finais
FRONTEND_URL=$(az container show --resource-group $RG --name frontend --query ipAddress.fqdn -o tsv)

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${BLUE}🌐 URLs da sua aplicação:${NC}"
echo -e "   ${GREEN}Frontend: http://$FRONTEND_URL:3000${NC}"
echo -e "   ${GREEN}Backend:  http://$BACKEND_URL:8080${NC}"
echo ""
echo -e "${YELLOW}📋 Informações do deploy:${NC}"
echo -e "   Resource Group: $RG"
echo -e "   Container Registry: $ACR_NAME"
echo -e "   Localização: $LOCATION"
echo ""
echo -e "${BLUE}💡 Comandos úteis:${NC}"
echo -e "   Ver logs frontend: ${YELLOW}az container logs --resource-group $RG --name frontend${NC}"
echo -e "   Ver logs backend:  ${YELLOW}az container logs --resource-group $RG --name backend${NC}"
echo -e "   Deletar recursos:  ${RED}az group delete --name $RG --yes --no-wait${NC}"
echo ""
echo -e "${GREEN}🎉 Sua aplicação está online!${NC}"e
