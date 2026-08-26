# StorageCloudnary-Expo
## Neste Repositório você encontrará:
- Instalação das depedências
- Configuração do Cloudnary
- Upload de imagem
## Aluno: Jonnas Pedro | Turma: 3 Ano B

# Comandos

## Criação do Projeto

- npx create-expo-app meuapp --template bare-minimum@sdk-54
- cd meuapp

## Instalação das Dependências

### Navegação
- npm install @react-navigation/native
- npm install @react-navigation/native-stack
- npm install @react-navigation/bottom-tabs
- npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

### UI e Ícones
- npm install react-native-elements
- npm install react-native-vector-icons
- npx expo install @expo/vector-icons

### Funcionalidades Expo
- npx expo install expo-notifications expo-constants expo-device
- npx expo install expo-image-picker

### Serviços e Comunicação
- npm install axios
- npm install firebase
- npx expo install react-dom react-native-web

### Finalizar Instalação
- npm install

### Instalação das Ferramentas Globais
- npm install -g expo-cli
- npm install -g eas-cli

### Autenticação no Expo
- eas login
  - E-mail
  - Senha

### Configuração do Projeto para EAS
- eas build:configure
  - yes
  - yes
  - enter
  - ALL

### Gerar APK Preview
- eas build -p android --profile preview
  - Acesse o link gerado e aguarde a conclusão do APK

## Verificando Dependências

- npx @ngrok
- npm install @ngrok/ngrok

## npx expo start --tunnel

- Acesar o app Expo Go
- Escanear o QrCode
- Copiar o código

## Link do Expo - Envio de Notificação

https://expo.dev/notifications
