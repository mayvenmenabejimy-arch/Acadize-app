import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import {
  MessagesSquare,
  Users,
  Send,
  Hash,
  Sparkles,
} from 'lucide-react-native';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isMe: boolean;
}

export const StudyGroupsScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const groups = [
    { id: 'g1', name: 'Calculus Study Circle', members: 18, active: true },
    { id: 'g2', name: 'Physics Exam Prep & Lab', members: 12, active: false },
    { id: 'g3', name: 'Chemistry Discussion', members: 9, active: false },
  ];

  const [activeGroup, setActiveGroup] = useState(groups[0]);
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'Layla El-Sayed',
      avatar: 'L',
      text: 'Has anyone finished problem #4 on tangent lines? The derivative gets a bit messy.',
      time: '10:14 AM',
      isMe: false,
    },
    {
      id: 'm2',
      sender: 'Karim Mostafa',
      avatar: 'K',
      text: 'Yes! Use product rule first before applying chain rule. It simplifies down to 2x·cos(x).',
      time: '10:16 AM',
      isMe: false,
    },
    {
      id: 'm3',
      sender: 'You',
      avatar: 'Y',
      text: 'Thanks Karim! That completely cleared it up.',
      time: '10:18 AM',
      isMe: true,
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: 'Y',
      text: inputText.trim(),
      time: 'Just now',
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Study Groups Chat" subtitle="Collaborate with your classmates" />

      {/* Group Room Selector Chips */}
      <View style={styles.groupChipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupChipsList}>
          {groups.map((g) => {
            const isSelected = activeGroup.id === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.groupChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => setActiveGroup(g)}
              >
                <Hash size={14} color={isSelected ? '#FFFFFF' : colors.primaryLight} />
                <Text style={[styles.groupChipText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                  {g.name} ({g.members})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.messagesList}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.isMe ? styles.myMessageRow : styles.theirMessageRow,
            ]}
          >
            {!msg.isMe && (
              <View style={[styles.msgAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.msgAvatarText}>{msg.avatar}</Text>
              </View>
            )}

            <View style={{ maxWidth: '80%' }}>
              {!msg.isMe && (
                <Text style={[styles.senderName, { color: colors.textMuted }]}>{msg.sender}</Text>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.isMe
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 },
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    { color: msg.isMe ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
              <Text
                style={[
                  styles.timeText,
                  {
                    color: colors.textSubtle,
                    textAlign: msg.isMe ? 'right' : 'left',
                  },
                ]}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Chat Input Bar */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.divider }]}>
        <TextInput
          style={[
            styles.inputField,
            {
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.text,
            },
          ]}
          placeholder={`Message #${activeGroup.name}...`}
          placeholderTextColor={colors.textSubtle}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.primary }]}
          onPress={handleSend}
        >
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  groupChipsContainer: {
    paddingVertical: 10,
  },
  groupChipsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  groupChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  messagesList: {
    padding: 16,
    gap: 14,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  msgAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  inputField: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
