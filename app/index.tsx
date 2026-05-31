import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("aluno@faculdade.edu.br");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    router.push("/salas");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Hero Section */}
          <View className="bg-primary-500 h-[55%] justify-center items-center rounded-b-[48px]">
            <View className="bg-white/20 p-5 rounded-2xl mb-4">
              <Ionicons name="library" size={56} color="white" />
            </View>
            <Text className="text-white text-4xl font-bold tracking-tight">
              SmartBib
            </Text>
            <Text className="text-white/80 text-base mt-2 text-center px-8">
              Reserve salas de estudo da biblioteca{"\n"}de forma rápida e simples
            </Text>
          </View>

          {/* Login Form */}
          <View className="flex-1 px-6 -mt-8">
            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                Entrar
              </Text>

              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email institucional
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
                placeholder="seu@email.edu.br"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text className="text-sm font-medium text-gray-700 mb-1">
                Senha
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-6"
                placeholder="Sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />

              <TouchableOpacity
                className="bg-primary-500 rounded-xl py-4 items-center"
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-semibold">Entrar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="items-center mt-6"
              onPress={() => router.push("/cadastro")}
            >
              <Text className="text-primary-600 text-base">
                Não tem conta? Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
