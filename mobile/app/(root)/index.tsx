import { useUser } from '@clerk/clerk-expo'
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { useTransactions } from '@/hooks/useTransactions';
import { useEffect, useState } from 'react';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SignOutButton } from '@/components/SignOutButton';
import BalanceCard from '@/components/BalanceCard';
import { TransactionItem } from "@/components/TransactionItem";
import NoTransactionsFound from '@/components/NoTransactionsFound';

export default function Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  if (!isLoaded || !user) {
    return <Text>Loading...</Text>;
  }

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id);

  const onRefresh = async()=>{
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handleDelete = (id: string) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ])
  }
  if (isLoading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.headerLogo}
              contentFit='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user.primaryEmailAddress?.emailAddress.split("@")[0].slice(0, 14) || "User"}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create" as any)}>
                <Ionicons name='add-circle' size={20} color={"#FFF"} />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <SignOutButton />
            </View>
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}