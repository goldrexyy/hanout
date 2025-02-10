import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ApplicationProvider, IconRegistry, Layout, Text, Card, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const PerformanceScreen = () => {
  const screenWidth = width;

  const revenueToday = 1500;
  const revenueYesterday = 1300;
  const invoicesToday = 20;
  const invoicesYesterday = 25;

  const getArrow = (today, yesterday) => today > yesterday ? 'arrow-upward' : 'arrow-downward';
  const getColor = (today, yesterday) => today > yesterday ? 'green' : 'red';

  const barChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        data: [1200, 1800, 1300, 1900, 1500],
        color: () => '#666',
        strokeWidth: 0,
      },
    ],
  };

  const lineChartData = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        data: [100, 200, 300, 400, 500, 600, 1700],
        color: () => `#3682B3`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#f6f6f6',
    backgroundGradientFrom: '#f6f6f6',
    backgroundGradientTo: '#f6f6f6',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1.4,
    strokeWidth: 2,
    propsForBackgroundLines: {
      stroke: '#f6f6f6',
      strokeOpacity: 0,
    },
    fillShadowGradient: '#3682B3',
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: 'green',
    fillShadowGradientTo: 'green',
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: 'green',
    },
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <Layout style={styles.container}
>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* KPI Row */}
          <View style={styles.kpiRow}>
            <Card style={styles.kpiCard}>
              <Ionicons name="wallet-sharp" size={width * 0.1} />
              <Text category="h6">Total Revenue</Text>
              <Text category="h1">{revenueToday} Dh</Text>
              <View style={styles.kpiFooter}>
                <Icon name={getArrow(revenueToday, revenueYesterday)} fill={getColor(revenueToday, revenueYesterday)} style={styles.icon} />
                <Text style={{ color: getColor(revenueToday, revenueYesterday) }}>Yesterday: {revenueYesterday}</Text>
              </View>
            </Card>
            <Card style={styles.kpiCard}>
              <Ionicons name="document" size={width * 0.1} />
              <Text category="h6">Invoices Issued</Text>
              <Text category="h1">{invoicesToday}</Text>
              <View style={styles.kpiFooter}>
                <Icon name={getArrow(invoicesToday, invoicesYesterday)} fill={getColor(invoicesToday, invoicesYesterday)} style={styles.icon} />
                <Text style={{ color: getColor(invoicesToday, invoicesYesterday) }}>Yesterday: {invoicesYesterday}</Text>
              </View>
            </Card>
          </View>

          {/* Additional KPIs */}
          <View style={styles.additionalKPISection}>
            <Text category="h5" style={styles.sectionTitle}>Detailed KPIs</Text>
            <View style={styles.kpiRow}>
              <Card style={styles.kpiCardSmall}>
                <Ionicons name="document-text-outline" size={width * 0.08} />
                <Text category="s1">Unpaid Invoices</Text>
                <Text category="h4">5</Text>
                <Text>Total: 300 Dh</Text>
              </Card>
              <Card style={styles.kpiCardSmall}>
                <Ionicons name="bag-sharp" size={width * 0.08} />
                <Text category="s1">Top Selling Product</Text>
                <Text category="h5">Product A</Text>
                <Text>20 units sold</Text>
              </Card>
            </View>
          </View>

          {/* Revenue Trend - Bar Chart */}
          <View style={styles.graphContainer}>
            <Text category="h5" style={styles.sectionTitle}>Revenue Trend</Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 50}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>

          {/* Total Revenue - Line Chart */}
          <View style={styles.graphContainer}>
            <Text category="h5" style={styles.sectionTitle}>Total Revenue</Text>
            <LineChart
              data={lineChartData}
              width={width - 30}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>
        </ScrollView>
      </Layout>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 40,
    backgroundColor: '#F6F6F6',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  kpiCard: {
    flex: 0.48,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth: width * 0.007,
    borderColor: '#666',
  },
  kpiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
    marginRight: 10,
  },
  graphContainer: {
    marginVertical: 20,
  },
  chart: {
    borderRadius: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 10,
    textAlign: 'left',
  },
  additionalKPISection: {
    marginVertical: 20,
  },
  kpiCardSmall: {
    flex: 0.48,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth: width * 0.007,
    borderColor: '#666',
  },
});

export default PerformanceScreen;
