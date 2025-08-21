import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const meetings = [
    {
      id: '1',
      title: 'Marketing Strategy Review',
      time: '10:00 AM',
      duration: '1 hour',
      type: 'video',
      attendees: 4,
      color: '#6B46C1',
    },
    {
      id: '2',
      title: 'Client Onboarding',
      time: '2:00 PM',
      duration: '30 min',
      type: 'in-person',
      location: 'Conference Room A',
      attendees: 2,
      color: '#14B8A6',
    },
    {
      id: '3',
      title: 'Team Standup',
      time: '4:30 PM',
      duration: '15 min',
      type: 'video',
      attendees: 6,
      color: '#F59E0B',
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number | null) => {
    if (!day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleAddMeeting = () => {
    console.log('Adding new meeting');
    Alert.alert('Add Meeting', 'Meeting scheduler would open here');
  };

  const handleMeetingPress = (meetingId: string) => {
    console.log('Opening meeting:', meetingId);
    Alert.alert('Meeting Details', 'Meeting details would open here');
  };

  const handleBookingLinkPress = (linkType: string) => {
    console.log('Opening booking link:', linkType);
    Alert.alert('Booking Link', `${linkType} booking page would open here`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <ChevronLeft size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <ChevronRight size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {getDaysInMonth(currentMonth).map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isToday(day) && styles.todayCell,
                isSelected(day) && styles.selectedCell,
              ]}
              onPress={() => {
                if (day) {
                  const newDate = new Date(currentMonth);
                  newDate.setDate(day);
                  setSelectedDate(newDate);
                }
              }}
              disabled={!day}
            >
              {day && (
                <Text style={[
                  styles.dayText,
                  isToday(day) && styles.todayText,
                  isSelected(day) && styles.selectedText,
                ]}>
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.meetingsSection}>
        <View style={styles.meetingsHeader}>
          <Text style={styles.meetingsTitle}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddMeeting}
          >
            <Plus size={20} color="#6B46C1" />
          </TouchableOpacity>
        </View>

        {meetings.map((meeting) => (
          <TouchableOpacity 
            key={meeting.id} 
            style={styles.meetingCard}
            onPress={() => handleMeetingPress(meeting.id)}
          >
            <View style={[styles.meetingIndicator, { backgroundColor: meeting.color }]} />
            <View style={styles.meetingContent}>
              <Text style={styles.meetingTitle}>{meeting.title}</Text>
              <View style={styles.meetingDetails}>
                <View style={styles.meetingDetail}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.meetingDetailText}>
                    {meeting.time} • {meeting.duration}
                  </Text>
                </View>
                {meeting.type === 'video' ? (
                  <View style={styles.meetingDetail}>
                    <Video size={14} color="#6B7280" />
                    <Text style={styles.meetingDetailText}>Video Call</Text>
                  </View>
                ) : (
                  <View style={styles.meetingDetail}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.meetingDetailText}>{meeting.location}</Text>
                  </View>
                )}
                <View style={styles.meetingDetail}>
                  <Users size={14} color="#6B7280" />
                  <Text style={styles.meetingDetailText}>{meeting.attendees} attendees</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickBooking}>
        <Text style={styles.quickBookingTitle}>Quick Booking Links</Text>
        <TouchableOpacity 
          style={styles.bookingLink}
          onPress={() => handleBookingLinkPress('15-min Quick Call')}
        >
          <View style={styles.bookingIcon}>
            <Clock size={20} color="#6B46C1" />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingName}>15-min Quick Call</Text>
            <Text style={styles.bookingUrl}>framefy.com/book/quick</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookingLink}
          onPress={() => handleBookingLinkPress('30-min Demo')}
        >
          <View style={styles.bookingIcon}>
            <Video size={20} color="#14B8A6" />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingName}>30-min Demo</Text>
            <Text style={styles.bookingUrl}>framefy.com/book/demo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500' as const,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: '#6B46C1',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#1F2937',
  },
  todayText: {
    fontWeight: '600' as const,
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  meetingsSection: {
    padding: 16,
  },
  meetingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  meetingsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B46C120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  meetingIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  meetingContent: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 8,
  },
  meetingDetails: {
    gap: 6,
  },
  meetingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meetingDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  quickBooking: {
    padding: 16,
  },
  quickBookingTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  bookingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1F2937',
    marginBottom: 2,
  },
  bookingUrl: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
