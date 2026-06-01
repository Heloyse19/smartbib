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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { register } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CadastroScreen() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!email.trim() || !matricula.trim() || !senha.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const data = await register(email.trim(), matricula.trim(), senha);
      await setAuth(data.email, data.userId, data.token);
      Alert.alert("Conta criada!", "Bem-vindo ao SmartBib!", [
        { text: "OK", onPress: () => router.replace("/salas") },
      ]);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Hero */}
          <View className="bg-primary-500 h-[40%] justify-center items-center rounded-b-[48px]">
            <TouchableOpacity
              className="absolute top-4 left-4"
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-3xl font-bold">SmartBib</Text>
            <Text className="text-white/80 text-base mt-2">
              Criar nova conta
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1 px-6 -mt-8">
            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                Cadastro
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
                editable={!loading}
              />

              <Text className="text-sm font-medium text-gray-700 mb-1">
                Matrícula
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
                placeholder="Número de matrícula"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numeric"
                editable={!loading}
              />

              <Text className="text-sm font-medium text-gray-700 mb-1">
                Senha
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-6"
                placeholder="Crie uma senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                editable={!loading}
              />

              <TouchableOpacity
                className="bg-primary-500 rounded-xl py-4 items-center flex-row justify-center gap-2"
                onPress={handleCadastro}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading && <ActivityIndicator color="white" size="small" />}
                <Text className="text-white text-lg font-semibold">
                  {loading ? "Criando..." : "Criar Conta"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="items-center mt-6"
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text className="text-primary-600 text-base">
                Já tem conta? Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
