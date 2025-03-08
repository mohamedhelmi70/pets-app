import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, } from 'react-native';
import { Pet, BodyConditionLog, WeightLog, AppScreenProps, VetVisitLog } from '../../types';
import { supabase } from '../../services';

const TABS = [
  {id: 'Weight_Logs', name: 'Weight Logs'},
  {id: 'Body_Condition', name: 'Body Condition'},
  {id: 'Vet_Visits', name: 'Vet Visits'},
]

function getThisMonthLogs(logs_bodycondition: BodyConditionLog[], logs_weight: WeightLog[]) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const latestBodyConditionLog = logs_bodycondition
    .filter(
      (log) =>
        new Date(log?.date).getMonth() === currentMonth &&
        new Date(log?.date).getFullYear() === currentYear
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestWeightLog = logs_weight
    .filter(
      (log) =>
        new Date(log?.date).getMonth() === currentMonth &&
        new Date(log?.date).getFullYear() === currentYear
    )
    .sort((a, b) => new Date(b?.date).getTime() - new Date(a?.date).getTime())?.[0];

  return { latestBodyConditionLog, latestWeightLog };
}

const PetCard = React.memo(({ pet }: { pet: Pet }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{pet.name}</Text>
    <Text>Species: {pet.species}</Text>
    <Text>Age: {pet.age} years</Text>
  </View>
));

const LogsTable = React.memo(({ data, }: { data: {id: string; name: string; date: string}[], }) => {

  if(data?.length == 0) {
    return (
      <View style={styles.table}>
        <Text>There are no logs</Text>
      </View>
    )
  }

  return (
    <View style={styles.table}>
      {data?.map((log, index) => (
        <View key={index} style={styles.tableRow}>
          <Text>{log?.name}</Text>
          <Text>{log?.date}</Text>
        </View>
      ))}
    </View>
  )
});

const VetVisitsTable = React.memo(({ data, onAddNew}: { data: VetVisitLog[], onAddNew: () => void}) => {

  if(data?.length == 0) {
    return (
      <View style={styles.table}>
        <Text>There are no logs</Text>
      </View>
    )
  }

  return (
    <View style={styles.table}>
      {data?.map((log, index) => (
        <View key={index} style={styles.vet_visit_card}>
          <Text>{log?.notes}</Text>
          <Text>{new Date(log?.date)?.toLocaleDateString()}</Text>
        </View>
      ))}

      <TouchableOpacity activeOpacity={.8} onPress={onAddNew} style={styles.button}>
        <Text style={styles.button_text}>
          Add new vet visit
        </Text>
      </TouchableOpacity>
    </View>
  )
});

const HealthStatus = React.memo(({ pet }: { pet: Pet }) => (
  <View style={styles.healthStatus}>
    <Text style={styles.tableHeader}>Health Status</Text>
    <Text>Overall Health: {pet?.logs_weight?.length > 3 ? 'Good' : 'Needs More Data'}</Text>
    <Text>Last Vet Visit: 2 months ago</Text>
  </View>
));

const TabSelector = React.memo(({ tabs, activeTab, onTabChange }: { tabs: typeof TABS, activeTab: string, onTabChange: (id: string) => void }) => (
  <View style={styles.tabs}>
    {tabs.map(tab => (
      <TouchableOpacity 
        key={tab.id}
        disabled={tab.id === activeTab} 
        onPress={() => onTabChange(tab.id)} 
        style={[styles.tab, {backgroundColor: activeTab === tab.id ? '#f7f9e8' : '#fff'}]}
      >
        <Text style={[styles.tab_title, {color: activeTab === tab.id ? '#111' : '#7f7f7f'}]}>
          {tab.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
));

export const SingleProfileScreen: React.FC<AppScreenProps<'SingleProfile'>> = ({ route }) => {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(TABS?.[0]?.id); 
  const [error, setError] = useState<string | null>(null);
  const [petData, setPetData] = useState<{
    pet: Pet | null;
    weightLogs: WeightLog[];
    bodyConditionLogs: BodyConditionLog[];
    vetVisitLogs: VetVisitLog[];
  }>({
    pet: null,
    weightLogs: [],
    bodyConditionLogs: [],
    vetVisitLogs: []
  });
  const [thisMonthLogs, setThisMonthLogs] = useState<{
    latestBodyConditionLog: BodyConditionLog | null;
    latestWeightLog: WeightLog | null;
  }>({
    latestBodyConditionLog: null,
    latestWeightLog: null,
  });

  const tab_obj = useMemo(() => {
    return TABS?.find(e => e?.id === tab);
  }, [tab]);

  const handleTabChange = React.useCallback((tabId: string) => {
    setTab(tabId);
  }, []);

  useEffect(() => {
    const fetchPetData = async () => {
      setLoading(true);
      try {
        const [petResult, weightResult, bodyConditionResult, vetVisitResult] = await Promise.all([
          supabase.from('pets').select().eq('id', id).single(),
          supabase.from('weight_logs').select().eq('pet_id', id),
          supabase.from('body_condition_logs').select().eq('pet_id', id),
          supabase.from('vet_visit_logs').select().eq('pet_id', id)
        ]);

        if (petResult.error) throw new Error(petResult?.error?.message);
        
        setPetData({
          pet: petResult?.data || null,
          weightLogs: weightResult?.data || [],
          bodyConditionLogs: bodyConditionResult?.data || [],
          vetVisitLogs: vetVisitResult?.data || []
        });
      } catch (err: any) {
        console.error('Error fetching pet data:', err?.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  useEffect(() => {
    if (petData?.weightLogs && petData?.bodyConditionLogs) {
      setThisMonthLogs(getThisMonthLogs(petData?.bodyConditionLogs, petData?.weightLogs));
    }
  }, [petData?.vetVisitLogs, petData?.bodyConditionLogs]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

 

  if (error || !petData?.pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll_content}>
      <PetCard pet={petData?.pet} />
      
      <View style={styles.monthSummary}>
        <Text style={styles.tableHeader}>This Month's Summary</Text>
        <Text>
          Latest Weight: {thisMonthLogs?.latestWeightLog?.weight || 'No data'} kg
        </Text>
        <Text>
          Body Condition: {thisMonthLogs?.latestBodyConditionLog?.body_condition || 'No data'}
        </Text>
      </View>

      <HealthStatus pet={petData?.pet} />
      
      <TabSelector 
        tabs={TABS} 
        activeTab={tab} 
        onTabChange={handleTabChange} 
      />
      
      {tab_obj?.id === 'Weight_Logs' && <LogsTable data={petData?.weightLogs?.map(e => ({...e, name: `Weight: ${e?.weight}Kg`, date: `Date: ${new Date(e?.date)?.toLocaleDateString()}`}))} />}
      {tab_obj?.id === 'Body_Condition' && <LogsTable data={petData?.bodyConditionLogs?.map(e => ({...e, name: `${e?.body_condition}`, date: `Date: ${new Date(e?.date)?.toLocaleDateString()}`}))} />}
      {tab_obj?.id === 'Vet_Visits' && <VetVisitsTable onAddNew={() => {}} data={petData?.vetVisitLogs} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll_content: {
    paddingBottom: 30,
  },
  card: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    marginTop: 16,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthSummary: {
    padding: 16,
    backgroundColor: '#e6f3ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  healthStatus: {
    padding: 16,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    marginBottom: 16,
  },
  tabs: {
    marginTop: 5,
    height: 45,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: .7,
    borderColor: '#e3e6e8'
  },
  tab: {
    width: '33.5%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  tab_title: {
    fontSize: 14,
    fontWeight: '600',
  },
  vet_visit_card: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
    borderRadius: 8,
    gap: 5
  },
  button: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: .7,
    borderColor: '#e3e6e8',
    backgroundColor: '#111',
    borderRadius: 8,
    marginTop: 10
  },
  button_text: {
    color: '#fff'
  }
}); 