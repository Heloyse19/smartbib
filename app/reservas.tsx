import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getReservas, cancelReserva, ocuparReserva, deletarReservaPermanentemente, limparHistorico, type Reserva } from "@/services/api";

function isWithinTimeSlot(reservation: Reserva): boolean {
  const now = new Date();
  const [y, m, d] = reservation.date.split("-").map(Number);
  const [startH, startM] = reservation.horaInicio.split(":").map(Number);
  const [endH, endM] = reservation.horaFim.split(":").map(Number);
  const inicio = new Date(y, m - 1, d, startH, startM, 0, 0);
  const fim = new Date(y, m - 1, d, endH, endM, 0, 0);
  return now >= inicio && now <= fim;
}

function isFinished(reservation: Reserva): boolean {
  if (reservation.status === "cancelada") return true;
  const now = new Date();
  const [y, m, d] = reservation.date.split("-").map(Number);
  const [endH, endM] = reservation.horaFim.split(":").map(Number);
  const fim = new Date(y, m - 1, d, endH, endM, 0, 0);
  return now > fim;
}

export default function ReservasScreen() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"ativas" | "historico">("ativas");

  // Estados para modais
  const [confirmingLiberar, setConfirmingLiberar] = useState<Reserva | null>(null);
  const [confirmingOcupar, setConfirmingOcupar] = useState<Reserva | null>(null);
  const [confirmingExcluirHistorico, setConfirmingExcluirHistorico] = useState<Reserva | null>(null);
  const [confirmingLimparHistorico, setConfirmingLimparHistorico] = useState(false);
  const [liberando, setLiberando] = useState(false);
  const [ocupando, setOcupando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [limpando, setLimpando] = useState(false);

  const loadReservas = async () => {
    try {
      const data = await getReservas();
      setReservations(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar suas reservas");
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        await loadReservas();
        setLoading(false);
      })();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReservas();
    setRefreshing(false);
  }, []);

  const ativas = reservations.filter(r => !isFinished(r));
  const historico = reservations.filter(r => isFinished(r));

  const doLiberar = async (reservation: Reserva) => {
    setLiberando(true);
    try {
      await cancelReserva(reservation.id);
      setReservations((prev) =>
        prev.map((r) => (r.id === reservation.id ? { ...r, status: "cancelada" } : r))
      );
      Alert.alert("Sala Liberada!", `${reservation.roomName} foi liberada.`);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao liberar sala");
    } finally {
      setLiberando(false);
      setConfirmingLiberar(null);
    }
  };

  const doConfirmar = async (reservation: Reserva) => {
    setOcupando(true);
    try {
      await ocuparReserva(reservation.id);
      setReservations((prev) =>
        prev.map((r) => (r.id === reservation.id ? { ...r, status: "confirmada" } : r))
      );
      Alert.alert("Reserva Confirmada!", `${reservation.roomName} foi confirmada.`);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao confirmar reserva");
    } finally {
      setOcupando(false);
      setConfirmingOcupar(null);
    }
  };

  const doExcluirHistorico = async (reservation: Reserva) => {
    setExcluindo(true);
    try {
      await deletarReservaPermanentemente(reservation.id);
      setReservations((prev) => prev.filter(r => r.id !== reservation.id));
      Alert.alert("Reserva removida", "A reserva foi excluída do histórico.");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao excluir reserva");
    } finally {
      setExcluindo(false);
      setConfirmingExcluirHistorico(null);
    }
  };

  const doLimparHistorico = async () => {
    setLimpando(true);
    try {
      await limparHistorico();
      await loadReservas();
      Alert.alert("Histórico limpo", "Todas as reservas finalizadas foram removidas.");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao limpar histórico");
    } finally {
      setLimpando(false);
      setConfirmingLimparHistorico(false);
    }
  };

  const renderReservationCard = (reservation: Reserva, isHistorico: boolean) => (
    <View key={reservation.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 bg-primary-50 rounded-xl items-center justify-center">
            <Ionicons name="calendar" size={20} color="#0ea5e9" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-gray-900">{reservation.roomName}</Text>
            <Text className="text-sm text-gray-500">{reservation.date} · {reservation.time}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={`px-3 py-1 rounded-full ${
            reservation.status === "confirmada" ? "bg-green-100" :
            reservation.status === "cancelada" ? "bg-red-100" : "bg-amber-100"
          }`}>
            <Text className={`text-xs font-medium ${
              reservation.status === "confirmada" ? "text-green-700" :
              reservation.status === "cancelada" ? "text-red-700" : "text-amber-700"
            }`}>
              {reservation.status === "confirmada" ? "Confirmada" :
               reservation.status === "cancelada" ? "Cancelada" : "Pendente"}
            </Text>
          </View>
          {isHistorico ? (
            <TouchableOpacity onPress={() => setConfirmingExcluirHistorico(reservation)}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          ) : (
            reservation.status !== "cancelada" && (
              <TouchableOpacity onPress={() => setConfirmingExcluirHistorico(reservation)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {!isHistorico && reservation.status !== "cancelada" && (
        <View className="flex-row gap-3 mt-3">
          {reservation.status === "pendente" && isWithinTimeSlot(reservation) && (
            <TouchableOpacity
              className="flex-1 bg-green-50 border border-green-200 rounded-xl py-3 items-center flex-row justify-center gap-2"
              onPress={() => setConfirmingOcupar(reservation)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              <Text className="text-green-600 font-semibold text-sm">Confirmar</Text>
            </TouchableOpacity>
          )}
          {reservation.status === "pendente" && !isWithinTimeSlot(reservation) && (
            <View className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 items-center flex-row justify-center gap-2">
              <Ionicons name="time" size={16} color="#9ca3af" />
              <Text className="text-gray-400 font-medium text-xs">Confirme no horário</Text>
            </View>
          )}
          <TouchableOpacity
            className="flex-1 bg-red-50 border border-red-200 rounded-xl py-3 items-center flex-row justify-center gap-2"
            onPress={() => setConfirmingLiberar(reservation)}
          >
            <Ionicons name="lock-open" size={18} color="#ef4444" />
            <Text className="text-red-600 font-semibold text-sm">Liberar</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text className="text-gray-400 text-xs text-center mt-1">Reserva #{reservation.id}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 uppercase tracking-wider">Minhas reservas</Text>
          <Text className="text-xl font-bold text-gray-900">Gerenciar Reservas</Text>
        </View>
      </View>

      {/* Abas */}
      <View className="flex-row border-b border-gray-200 px-5 justify-between items-center">
        <View className="flex-row flex-1">
          <TouchableOpacity
            className={`py-3 px-4 ${activeTab === "ativas" ? "border-b-2 border-primary-500" : ""}`}
            onPress={() => setActiveTab("ativas")}
          >
            <Text className={`font-semibold ${activeTab === "ativas" ? "text-primary-500" : "text-gray-500"}`}>
              Ativas ({ativas.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-3 px-4 ${activeTab === "historico" ? "border-b-2 border-primary-500" : ""}`}
            onPress={() => setActiveTab("historico")}
          >
            <Text className={`font-semibold ${activeTab === "historico" ? "text-primary-500" : "text-gray-500"}`}>
              Histórico ({historico.length})
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "historico" && historico.length > 0 && (
          <TouchableOpacity onPress={() => setConfirmingLimparHistorico(true)} className="mr-2 p-2">
            <Ionicons name="trash-bin-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0ea5e9"]} tintColor="#0ea5e9" />
        }
      >
        {loading ? (
          <View className="items-center mt-20">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-gray-500 mt-3">Carregando reservas...</Text>
          </View>
        ) : activeTab === "ativas" ? (
          ativas.length === 0 ? (
            <View className="items-center justify-center mt-24">
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-base text-center mt-4">Nenhuma reserva ativa.</Text>
            </View>
          ) : (
            ativas.map(r => renderReservationCard(r, false))
          )
        ) : (
          historico.length === 0 ? (
            <View className="items-center justify-center mt-24">
              <Ionicons name="time-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-base text-center mt-4">Nenhuma reserva no histórico.</Text>
            </View>
          ) : (
            historico.map(r => renderReservationCard(r, true))
          )
        )}
      </ScrollView>

      {/* Modal Confirmar Liberação */}
      <Modal
        visible={confirmingLiberar !== null}
        transparent
        animationType="fade"
        onRequestClose={() => !liberando && setConfirmingLiberar(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4 mx-auto">
              <Ionicons name="warning" size={24} color="#ef4444" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">Liberar Sala</Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Deseja liberar a {confirmingLiberar?.roomName} ({confirmingLiberar?.date}, {confirmingLiberar?.time})?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                onPress={() => setConfirmingLiberar(null)}
                disabled={liberando}
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl py-3 items-center flex-row justify-center gap-2"
                onPress={() => confirmingLiberar && doLiberar(confirmingLiberar)}
                disabled={liberando}
              >
                {liberando ? <ActivityIndicator color="white" size="small" /> : null}
                <Text className="text-white font-semibold">{liberando ? "Liberando..." : "Liberar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Ocupação */}
      <Modal
        visible={confirmingOcupar !== null}
        transparent
        animationType="fade"
        onRequestClose={() => !ocupando && setConfirmingOcupar(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-4 mx-auto">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">Confirmar Reserva</Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Deseja confirmar a {confirmingOcupar?.roomName} ({confirmingOcupar?.date}, {confirmingOcupar?.time})?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                onPress={() => setConfirmingOcupar(null)}
                disabled={ocupando}
              >
                <Text className="text-gray-700 font-semibold">Não</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-xl py-3 items-center flex-row justify-center gap-2"
                onPress={() => confirmingOcupar && doConfirmar(confirmingOcupar)}
                disabled={ocupando}
              >
                {ocupando ? <ActivityIndicator color="white" size="small" /> : null}
                <Text className="text-white font-semibold">{ocupando ? "Confirmando..." : "Sim, confirmar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Exclusão de uma reserva do histórico */}
      <Modal
        visible={confirmingExcluirHistorico !== null}
        transparent
        animationType="fade"
        onRequestClose={() => !excluindo && setConfirmingExcluirHistorico(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4 mx-auto">
              <Ionicons name="trash" size={24} color="#ef4444" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">Excluir do Histórico</Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Tem certeza que deseja excluir a reserva da {confirmingExcluirHistorico?.roomName} ({confirmingExcluirHistorico?.date}, {confirmingExcluirHistorico?.time})?
              {"\n\n"}<Text className="font-bold">Essa ação não pode ser desfeita.</Text>
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                onPress={() => setConfirmingExcluirHistorico(null)}
                disabled={excluindo}
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl py-3 items-center flex-row justify-center gap-2"
                onPress={() => confirmingExcluirHistorico && doExcluirHistorico(confirmingExcluirHistorico)}
                disabled={excluindo}
              >
                {excluindo ? <ActivityIndicator color="white" size="small" /> : null}
                <Text className="text-white font-semibold">{excluindo ? "Excluindo..." : "Excluir"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Limpar TODO o histórico */}
      <Modal
        visible={confirmingLimparHistorico}
        transparent
        animationType="fade"
        onRequestClose={() => !limpando && setConfirmingLimparHistorico(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4 mx-auto">
              <Ionicons name="warning" size={24} color="#ef4444" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">Limpar todo o histórico</Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Isso removerá permanentemente todas as reservas finalizadas (canceladas ou com horário já encerrado).
              {"\n\n"}<Text className="font-bold">Essa ação não pode ser desfeita.</Text>
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                onPress={() => setConfirmingLimparHistorico(false)}
                disabled={limpando}
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl py-3 items-center flex-row justify-center gap-2"
                onPress={doLimparHistorico}
                disabled={limpando}
              >
                {limpando ? <ActivityIndicator color="white" size="small" /> : null}
                <Text className="text-white font-semibold">{limpando ? "Limpando..." : "Sim, limpar tudo"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}