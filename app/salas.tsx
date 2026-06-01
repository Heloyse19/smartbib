import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getSalas, logout, type Sala } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  users: "people",
  presentation: "easel",
  video: "videocam",
  briefcase: "briefcase",
};

const iconColors: Record<string, string> = {
  users: "#0ea5e9",
  presentation: "#8b5cf6",
  video: "#f59e0b",
  briefcase: "#22c55e",
};

const statusLabel: Record<string, string> = {
  livre: "Disponível",
  reservada: "Reservada",
  ocupada: "Ocupada",
};

const statusColor: Record<string, { bg: string; text: string }> = {
  livre: { bg: "bg-green-100", text: "text-green-700" },
  reservada: { bg: "bg-amber-100", text: "text-amber-700" },
  ocupada: { bg: "bg-red-100", text: "text-red-700" },
};

export default function SalasScreen() {
  const router = useRouter();
  const { auth, clearAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas();
      setSalas(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as salas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  const filtered = salas.filter((r) =>
    r.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    clearAuth();
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              Olá, {auth.email?.split("@")[0] || "Estudante"}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Salas disponíveis para reserva
            </Text>
          </View>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
              <Ionicons name="person" size={20} color="#0ea5e9" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 py-3 px-2 text-base text-gray-900"
            placeholder="Buscar sala..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {menuOpen && (
        <View
          className="absolute top-24 right-5 bg-white rounded-xl border border-gray-200 py-2 w-48 z-50"
          style={{ elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
        >
          <TouchableOpacity
            className="px-4 py-3 flex-row items-center gap-3"
            onPress={() => {
              setMenuOpen(false);
              router.push("/reservas");
            }}
          >
            <Ionicons name="calendar" size={18} color="#6b7280" />
            <Text className="text-gray-700 text-sm">
              Gerenciar reservas
            </Text>
          </TouchableOpacity>
          <View className="h-px bg-gray-100" />
          <TouchableOpacity
            className="px-4 py-3 flex-row items-center gap-3"
            onPress={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            <Ionicons name="log-out" size={18} color="#ef4444" />
            <Text className="text-red-500 text-sm">Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="items-center mt-20">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-gray-500 mt-3">Carregando salas...</Text>
          </View>
        ) : (
          <>
            <Text className="text-sm font-medium text-gray-500 mb-3">
              {filtered.length} salas encontradas
            </Text>

            {filtered.map((sala) => (
              <TouchableOpacity
                key={sala.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center active:bg-gray-50"
                onPress={() => router.push(`/reservar/${sala.id}`)}
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: (iconColors[sala.icon] || "#0ea5e9") + "20" }}
                >
                  <Ionicons
                    name={iconMap[sala.icon] || "people"}
                    size={22}
                    color={iconColors[sala.icon] || "#0ea5e9"}
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-900">
                    {sala.nome}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {sala.capacidade} pessoas · {sala.andar}º andar
                  </Text>
                </View>
                <View className="items-end">
                  <View
                    className={`px-3 py-1 rounded-full ${statusColor[sala.status]?.bg || "bg-gray-100"}`}
                  >
                    <Text
                      className={`text-xs font-medium ${statusColor[sala.status]?.text || "text-gray-700"}`}
                    >
                      {statusLabel[sala.status] || sala.status}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#d1d5db"
                    style={{ marginTop: 8 }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
