import React, { useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CLOUD_NAME = 'csskwcl9';
const UPLOAD_PRESET = 'meuapp';

// URL do Cloudinary sem CORS
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function App() {
  const [imagem, setImagem] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const selecionarImagem = async () => {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        if (Platform.OS === 'web') {
          alert('Precisamos de acesso a sua galeria.');
        } else {
          Alert.alert('Permissao necessaria', 'Precisamos de acesso a sua galeria.');
        }
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets?.length > 0) {
        setImagem(resultado.assets[0]);
      }
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
      if (Platform.OS === 'web') {
        alert('Nao foi possivel selecionar a imagem.');
      } else {
        Alert.alert('Erro', 'Nao foi possivel selecionar a imagem.');
      }
    }
  };

  const enviarCloudinary = async () => {
    if (!imagem) {
      if (Platform.OS === 'web') {
        alert('Selecione uma imagem antes de enviar.');
      } else {
        Alert.alert('Atencao', 'Selecione uma imagem antes de enviar.');
      }
      return;
    }

    try {
      setEnviando(true);

      const formData = new FormData();

      const uriParts = imagem.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      if (Platform.OS === 'web') {
        const response = await fetch(imagem.uri);
        const blob = await response.blob();
        formData.append('file', blob, `imagem.${fileType}`);
      } else {
        formData.append('file', {
          uri: imagem.uri,
          name: `imagem.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      formData.append('upload_preset', UPLOAD_PRESET);

      // PARA WEB: Usa um proxy para evitar CORS
      let url = CLOUDINARY_URL;
      if (Platform.OS === 'web') {
        // Usa o proxy do Expo para evitar CORS
        url = `https://cors-anywhere.herokuapp.com/${CLOUDINARY_URL}`;
      }

      console.log('Enviando para:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      console.log('Resposta:', data);

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Erro no upload.');
      }

      const novaImagem = {
        id: data.public_id,
        url: data.secure_url,
      };

      setImagens((listaAntiga) => [novaImagem, ...listaAntiga]);
      setImagem(null);

      if (Platform.OS === 'web') {
        alert('Imagem enviada com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
      }
    } catch (error) {
      console.log('Erro no upload:', error);
      if (Platform.OS === 'web') {
        alert('Erro: ' + (error?.message || 'Nao foi possivel enviar a imagem.'));
      } else {
        Alert.alert('Erro', error?.message || 'Nao foi possivel enviar a imagem.');
      }
    } finally {
      setEnviando(false);
    }
  };

  const excluirImagem = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja remover esta imagem da lista?')) {
        const listaFiltrada = imagens.filter((item) => item.id !== id);
        setImagens(listaFiltrada);
        alert('Imagem removida da lista!');
      }
    } else {
      Alert.alert(
        'Excluir imagem',
        'Deseja remover esta imagem da lista?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => {
              const listaFiltrada = imagens.filter((item) => item.id !== id);
              setImagens(listaFiltrada);
              Alert.alert('Sucesso', 'Imagem removida da lista!');
            },
          },
        ]
      );
    }
  };

  const Botao = ({ titulo, onPress, disabled = false, vermelho = false }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.botao,
          vermelho && styles.botaoExcluir,
          disabled && styles.botaoDesativado,
        ]}
      >
        <Text style={styles.textoBotao}>{titulo}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titulo}>Upload de Imagem</Text>
      <Text style={styles.subtitulo}>Escolha uma imagem para enviar</Text>

      <Botao titulo="Escolher Imagem" onPress={selecionarImagem} />

      {imagem && (
        <View style={styles.areaSelecionada}>
          <Text style={styles.tituloSecao}>Imagem selecionada</Text>
          <Image
            source={{ uri: imagem.uri }}
            style={styles.imagemGrande}
            resizeMode="cover"
          />
          <Botao
            titulo={enviando ? 'Enviando...' : 'Enviar imagem'}
            onPress={enviarCloudinary}
            disabled={enviando}
          />
        </View>
      )}

      {enviando && (
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color="#111111" />
          <Text style={styles.textoCarregando}>Enviando imagem...</Text>
        </View>
      )}

      <View style={styles.listaContainer}>
        <Text style={styles.tituloLista}>Imagens adicionadas</Text>
        <Text style={styles.contador}>
          {imagens.length} {imagens.length === 1 ? 'imagem' : 'imagens'}
        </Text>

        {imagens.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.textoVazio}>Nenhuma imagem enviada ainda.</Text>
          </View>
        ) : (
          imagens.map((item, index) => (
            <View key={item.id || index} style={styles.itemImagem}>
              <Image
                source={{ uri: item.url }}
                style={styles.miniatura}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => excluirImagem(item.id)}
                style={styles.botaoExcluirItem}
                activeOpacity={0.8}
              >
                <Text style={styles.textoExcluir}>EXCLUIR</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
    backgroundColor: '#ffffff',
    minHeight: '100%',
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 17,
    color: '#666666',
    marginBottom: 25,
  },

  botao: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  botaoDesativado: {
    opacity: 0.5,
  },

  botaoExcluir: {
    backgroundColor: '#c62828',
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },

  areaSelecionada: {
    marginTop: 15,
    marginBottom: 25,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222222',
  },

  imagemGrande: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 15,
    backgroundColor: '#eeeeee',
  },

  carregando: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: '#555555',
  },

  listaContainer: {
    marginTop: 25,
  },

  tituloLista: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#111111',
  },

  contador: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 15,
  },

  vazio: {
    padding: 25,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
  },

  textoVazio: {
    color: '#777777',
    fontSize: 16,
  },

  itemImagem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },

  miniatura: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#dddddd',
  },

  botaoExcluirItem: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: '#c62828',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  textoExcluir: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});