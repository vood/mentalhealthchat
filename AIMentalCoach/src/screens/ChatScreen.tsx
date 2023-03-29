import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import Purchases from 'react-native-purchases';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import useAuth from '../useAuth';
import Config from 'react-native-config';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: ChatScreenNavigationProp;
};

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const saveChatHistory = async (uid: string, messages: Message[]) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({chatHistory: messages});
  } catch (error) {
    console.error(error);
  }
};

const ChatScreen: React.FC<Props> = ({navigation}) => {
  const [messages, setMessages] = useState<any>([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [input, setInput] = useState('');
  const {user} = useAuth();

  const loadChatHistory = async () => {
    if (user) {
      try {
        const doc = await firestore().collection('users').doc(user.uid).get();
        if (doc.exists) {
          const chatHistory = doc.data()?.chatHistory || [];
          setMessages(chatHistory);
          setMessagesCount(
            chatHistory.filter((m: Message) => m.role === 'user').length,
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    loadChatHistory();
  });

  const fetchReply = async (messages: Message[]) => {
    try {
      const formattedMessages = messages.map(message => ({
        role: message.role,
        content: message.content,
      }));

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {role: 'system', content: 'You are an AI mental coach.'},
            ...formattedMessages,
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Config.OPENAI_API_KEY}`,
          },
        },
      );

      const aiMessage = response.data.choices[0].message.content;
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        {id: Date.now(), role: 'assistant', content: aiMessage},
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const checkSubscriptionStatus = async () => {
    try {
      const purchaserInfo = await Purchases.getCustomerInfo();
      setSubscriptionActive(purchaserInfo.entitlements.active.pro.isActive);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const handleSendMessage = async () => {
    if (messagesCount >= 30 && !subscriptionActive) {
      navigation.navigate('Payment');
      return;
    }

    if (input.trim()) {
      // Send user message
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        {id: Date.now(), role: 'user', content: input},
      ]);

      // Fetch AI reply
      const aiMessage = await fetchReply(messages);

      // Update messages state with AI reply
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        {id: Date.now() + 1, role: 'assistant', content: aiMessage},
      ]);

      setMessagesCount(messagesCount + 1);

      // Save chat history to Firestore
      if (user) {
        saveChatHistory(user.uid, messages);
      }

      // Clear input
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({item}) => (
          <Text
            style={[
              styles.message,
              item.role === 'assistant' ? styles.assistant : styles.user,
            ]}>
            {item.content}
          </Text>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b73e9',
    color: '#fff',
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },
  sendButton: {
    backgroundColor: '#3b73e9',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
  },
});

export default ChatScreen;
