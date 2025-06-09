import React, { useState } from 'react';
import { View, Button, Text, FlatList, ActivityIndicator } from 'react-native';

const FetchQuestionsScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch('http://192.168.1.6:8081/api/questions/software-engineer');
    const data = await res.json();
    setQuestions(data.questions || []);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Get Software Engineer Questions" onPress={fetchQuestions} />
      {loading && <ActivityIndicator style={{ margin: 20 }} />}
      <FlatList
        data={questions}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => <Text style={{ marginVertical: 8 }}>{item.question}</Text>}
      />
    </View>
  );
};

export default FetchQuestionsScreen;