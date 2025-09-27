import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const days = [
  { day: '22', dayName: 'Mon' }, { day: '23', dayName: 'Tue' },
  { day: '24', dayName: 'Wed' }, { day: '25', dayName: 'Thu' },
  { day: '26', dayName: 'Fri' }, { day: '27', dayName: 'Sat' },
];

interface CalendarWidgetProps {
  theme: 'dark' | 'light';
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ theme }) => {
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Days of the week */}
      <TouchableOpacity>
      <View style={styles.daysContainer}>
        {days.map((item, index) => (
          <View
            style={[
              styles.dayItem,
              index !== 0 && { marginLeft: -15 }
            ]}
            key={index}
          >
            <Text style={styles.dayNumber}>{item.day}</Text>
            <Text style={styles.dayName}>{item.dayName}</Text>
          </View>
        ))}
      </View>
</TouchableOpacity>
      {/* Month Button */}
      <TouchableOpacity style={styles.monthButton}>
        <Text style={styles.monthButtonText}>September</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: 'dark' | 'light') => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#ffffffff' : '#2E2E2E',
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
  },
  dayNumber: {
    color: theme === 'dark' ? '#000000ff' : '#e9e4e4ff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  dayName: {
    color: theme === 'dark' ? '#000000ff' :'#e9e4e4ff',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  monthButton: {
    backgroundColor: theme === 'dark' ? '#FFFFFF' : '#2E2E2E',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 25,
  },
  monthButtonText: {
    color: theme === 'dark' ? '#121212' : '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
  }
});

export default CalendarWidget;

