import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Switch,
  Modal,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Animated from "react-native-reanimated";
import { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface Entry {
  id: string;
  type: "income" | "expense";
  amount: string;
  category: {
    label: string;
    value: string;
    color: string;
    icon: string;
  };
  date: string;
  time: string;
}

const categories = [
  { label: "Salary", value: "salary", color: "#4caf50", icon: "💰" },
  { label: "Food", value: "food", color: "#ff9800", icon: "🍔" },
  { label: "Transport", value: "transport", color: "#03a9f4", icon: "🚗" },
  { label: "Shopping", value: "shopping", color: "#e91e63", icon: "🛍️" },
  { label: "Subscriptions", value: "subscriptions", color: "#9163CD", icon: "🔁" },
  { label: "Utilities", value: "utilities", color: "#9EB1CF", icon: "🚰" },
  { label: "Pay Bill's", value: "paybills", color: "#DB0032", icon: "🧾" },
];

const App = () => {
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState(categories[0].value);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [isIntroVisible, setIsIntroVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroVisible(false);
    }, 2000); // Set the duration of the intro screen here
    return () => clearTimeout(timer);
  }, []);

  const addEntry = () => {
    if ((type === "income" && income) || (type === "expense" && expense)) {
      const amount = parseFloat(type === "income" ? income : expense).toFixed(2);
      const selectedCategory = categories.find((cat) => cat.value === category);
      const currentDate = new Date();
      setEntries([
        ...entries,
        {
          id: Math.random().toString(),
          type,
          amount,
          category: selectedCategory || categories[0], // Handle if selectedCategory is undefined
          date: currentDate.toLocaleDateString(),
          time: currentDate.toLocaleTimeString(),
        },
      ]);
      setIncome("");
      setExpense("");
      setDescription("");
      setModalVisible(false);
    }
  };

  const handleNumericPress = (num: number) => {
    if (type === "income") {
      setIncome((prev) => prev + num.toString());
    } else {
      setExpense((prev) => prev + num.toString());
    }
  };

  const handleDecimalPress = () => {
    if (type === "income") {
      if (!income.includes(".")) {
        setIncome((prev) => prev + ".");
      }
    } else {
      if (!expense.includes(".")) {
        setExpense((prev) => prev + ".");
      }
    }
  };

  const handleConfirm = () => {
    addEntry();
  };

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const styles = darkMode ? darkStyles : lightStyles;

  if (isIntroVisible) {
    return (
      <SafeAreaView style={styles.introContainer}>
        <Text style={styles.introText}>Continue</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.balanceBox}>
          <Text style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 5,
          }}>Balance</Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            ${(totalIncome - totalExpense).toFixed(2)}
          </Text>
        </View>
        <View style={styles.incomeExpenseContainer}>
          <View style={styles.incomeBox}>
            <Text style={styles.summaryTitle}>Total Income</Text>
            <Text style={styles.incomeAmount}>${totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.expenseBox}>
            <Text style={styles.summaryTitle}>Total Expense</Text>
            <Text style={styles.expenseAmount}>${totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 21,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Recent Transactions
      </Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.entry,
              {
                backgroundColor: "#f0f0f0",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
              },
            ]}
            entering={FadeInUp.delay(100).duration(300)}
            exiting={FadeOutDown.delay(100).duration(300)}
          >
            <View
              style={{
                backgroundColor: `${item.category?.color}50`,
                width: 45,
                height: 45,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{item.category?.icon}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Text style={styles.amountText}>${item.amount}</Text>
                <Text style={styles.entryText}>
                  {item.category?.label ?? ""}
                </Text>
              </View>
              <Text style={styles.dateTimeText}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </Animated.View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addGoalButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addGoalButton}>-</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  type === "expense" ? styles.activeTab : null,
                ]}
                onPress={() => setType("expense")}
              >
                <Text style={styles.tabText}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  type === "income" ? styles.activeTab : null,
                ]}
                onPress={() => setType("income")}
              >
                <Text style={styles.tabText}>Income</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.amountDisplay}>
              ${type === "income" ? income : expense}
            </Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              placeholderTextColor={darkMode ? "#ccc" : "#555"}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
            <ScrollView style={styles.additionalDetails}>
              <Text style={styles.dateTimeText}>
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Text>
              <Text style={styles.dateTimeText}>
                {new Date().toLocaleTimeString("en-US")}
              </Text>
            </ScrollView>
            <View style={styles.numericKeypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.numericKey}
                  onPress={() => handleNumericPress(num as number)}
                >
                  <Text style={styles.numericKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.confirmKey}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmKeyText}>Confirm</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}></Text>
       
      </View>
    </SafeAreaView>
  );
};

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  incomeExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  incomeBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  expenseBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  balanceBox: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f44336",
  },
  addButton: {
    backgroundColor: "#4caf50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 36,
    lineHeight: 36,
  },
  addGoalButton: {
    backgroundColor: "red",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    elevation: 5,
  },
  addGoalButtonText: {
    color: "#fff",
    fontSize: 36,
    lineHeight: 36,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#4caf50",
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 40,
  },
  numericKeypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  numericKey: {
    width: "30%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  numericKeyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmKey: {
    width: "100%",
    height: 50,
    backgroundColor: "#4caf50",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  confirmKeyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#4caf50",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  entry: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  entryText: {
    fontSize: 16,
    color: "#333",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#666",
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  introText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    backgroundColor: "#fff",
  },
  input: {
    ...sharedStyles.input,
    borderColor: "#ccc",
  },
  modalContent: {
    ...sharedStyles.modalContent,
    backgroundColor: "#fff",
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    backgroundColor: "#333",
  },
  input: {
    ...sharedStyles.input,
    borderColor: "#555",
  },
  modalContent: {
    ...sharedStyles.modalContent,
    backgroundColor: "#444",
  },
  introContainer: {
    ...sharedStyles.introContainer,
    backgroundColor: "#333",
  },
  introText: {
    ...sharedStyles.introText,
    color: "#fff",
  },
  summaryTitle: {
    ...sharedStyles.summaryTitle,
    color: "#fff",
  },
  incomeAmount: {
    ...sharedStyles.incomeAmount,
    color: "#4caf50",
  },
  expenseAmount: {
    ...sharedStyles.expenseAmount,
    color: "#f44336",
  },
  balanceBox: {
    ...sharedStyles.balanceBox,
    backgroundColor: "#444",
  },
  summaryContainer: {
    ...sharedStyles.summaryContainer,
    backgroundColor: "#444",
  },
  entry: {
    ...sharedStyles.entry,
    backgroundColor: "#444",
  },
  entryText: {
    ...sharedStyles.entryText,
    color: "#fff",
  },
  amountText: {
    ...sharedStyles.amountText,
    color: "#fff",
  },
  dateTimeText: {
    ...sharedStyles.dateTimeText,
    color: "#ccc",
  },
});

export default App;
