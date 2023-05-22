import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'

export default function New() {
  const router = useRouter()
  const { bottom, top } = useSafeAreaInsets()
  const [preview, setPreview] = useState(null)
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })
      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function handleCreateNewMemory() {
    const token = SecureStore.getItemAsync('token')
    let coverUrl = ''
    if (preview) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)
      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      coverUrl = uploadResponse.data.fileURL
    }
    await api.post(
      '/memories',
      { content, coverUrl, isPublic },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    router.push('/memories')
  }
  const toggleSwitch = () => {
    setIsPublic(!isPublic)
  }
  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NlwLogo />
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500 ">
          <Link href="memories" asChild>
            <Icon name="arrow-left" size={16} color="#fff" />
          </Link>
        </TouchableOpacity>
      </View>
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#767577', true: '#372560' }}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            id="public-switch"
          />
          <Text
            onPress={toggleSwitch}
            className="font-body text-base text-gray-200"
          >
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="border-dash h-32 items-center justify-center rounded-lg border border-gray-500 bg-black/20"
          onPress={openImagePicker}
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
              alt="coverage Image"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          placeholderTextColor="#56565a"
          className=" p-0 font-body text-lg text-gray-50"
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text
            className="font-alt text-sm uppercase text-black"
            onPress={handleCreateNewMemory}
          >
            salvar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
