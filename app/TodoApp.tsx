import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: 'personal' | 'work' | 'shopping' | 'health';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const CATEGORIES = [
  { id: 'personal', label: 'Personal', color: 'bg-purple-500', icon: '👤' },
  { id: 'work', label: 'Work', color: 'bg-blue-500', icon: '💼' },
  { id: 'shopping', label: 'Shopping', color: 'bg-green-500', icon: '🛒' },
  { id: 'health', label: 'Health', color: 'bg-red-400', icon: '❤️' },
];

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'text-gray-500' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { id: 'high', label: 'High', color: 'text-red-500' },
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Todo['category']>('personal');
  const [selectedPriority, setSelectedPriority] = useState<Todo['priority']>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Sample data
  useEffect(() => {
    const sampleTodos: Todo[] = [
      {
        id: '1',
        text: 'Complete project presentation',
        completed: false,
        category: 'work',
        priority: 'high',
        createdAt: new Date(),
      },
      {
        id: '2',
        text: 'Buy groceries for the week',
        completed: false,
        category: 'shopping',
        priority: 'medium',
        createdAt: new Date(),
      },
      {
        id: '3',
        text: 'Morning workout',
        completed: true,
        category: 'health',
        priority: 'low',
        createdAt: new Date(),
      },
    ];
    setTodos(sampleTodos);
  }, []);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        category: selectedCategory,
        priority: selectedPriority,
        createdAt: new Date(),
      };
      setTodos([newTodo, ...todos]);
      setInputText('');
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => todo.id !== id))
        }
      ]
    );
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getCategoryInfo = (category: Todo['category']) => 
    CATEGORIES.find(cat => cat.id === category);

  const getPriorityInfo = (priority: Todo['priority']) => 
    PRIORITIES.find(pri => pri.id === priority);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View className="bg-white pt-16 pb-6 px-6 shadow-sm">
        <Text className="text-3xl font-bold text-gray-800 mb-2">My Tasks</Text>
        <Text className="text-gray-600">
          {completedCount} of {totalCount} tasks completed
        </Text>
        <View className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <View 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <TextInput
          className="bg-white rounded-xl px-4 py-3 text-gray-700 shadow-sm border border-gray-100"
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-6 mb-4">
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            onPress={() => setFilter(filterType)}
            className={`flex-1 py-3 rounded-lg mr-2 ${
              filter === filterType 
                ? 'bg-blue-500' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <Text className={`text-center font-medium capitalize ${
              filter === filterType ? 'text-white' : 'text-gray-600'
            }`}>
              {filterType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Todo List */}
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: showAddForm ? 400 : 100 }}
      >
        <View>
          {filteredTodos.map((todo) => {
            const categoryInfo = getCategoryInfo(todo.category);
            const priorityInfo = getPriorityInfo(todo.priority);
            
            return (
              <View key={todo.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
                <View className="flex-row items-center">
                  {/* Priority Indicator */}
                  <View className={`w-1 h-12 rounded-full mr-3 ${
                    todo.priority === 'high' ? 'bg-red-500' :
                    todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  
                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                      todo.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}
                  >
                    {todo.completed && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </TouchableOpacity>

                  {/* Task Content */}
                  <View className="flex-1">
                    {editingId === todo.id ? (
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 text-gray-800 text-base mr-2 border-b border-blue-500 pb-1"
                          value={editingText}
                          onChangeText={setEditingText}
                          onSubmitEditing={saveEdit}
                          autoFocus
                          multiline
                        />
                        <TouchableOpacity onPress={saveEdit} className="mr-2">
                          <Text className="text-green-500 font-semibold">Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={cancelEdit}>
                          <Text className="text-red-500 font-semibold">Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => startEdit(todo)} className="flex-1">
                        <Text className={`text-base mb-2 ${
                          todo.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-800'
                        }`}>
                          {todo.text}
                        </Text>
                        <View className="flex-row items-center">
                          <View className={`${categoryInfo?.color} rounded-full px-3 py-1 mr-2`}>
                            <Text className="text-white text-xs font-medium">
                              {categoryInfo?.icon} {categoryInfo?.label}
                            </Text>
                          </View>
                          <Text className={`text-xs font-medium ${priorityInfo?.color}`}>
                            {priorityInfo?.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Delete Button */}
                  {editingId !== todo.id && (
                    <TouchableOpacity
                      onPress={() => deleteTodo(todo.id)}
                      className="ml-2 p-2"
                    >
                      <Text className="text-red-500 text-lg">🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {filteredTodos.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">📝</Text>
            <Text className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No matching tasks' : 'No tasks yet'}
            </Text>
            <Text className="text-gray-500 text-center">
              {searchQuery 
                ? 'Try adjusting your search or filter'
                : 'Add your first task to get started!'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Form */}
      {showAddForm && (
        <View 
          className="bg-white border-t border-gray-200 p-6"
          style={{ 
            marginBottom: Platform.OS === 'android' ? keyboardHeight : 0 
          }}
        >
          <TextInput
            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700 mb-4 border border-gray-200"
            placeholder="Enter new task..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTodo}
            autoFocus
            multiline
            placeholderTextColor="#9CA3AF"
          />
          
          {/* Category Selection */}
          <Text className="text-gray-700 font-medium mb-2">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id as Todo['category'])}
                className={`${category.color} rounded-full px-4 py-2 mr-3 ${
                  selectedCategory === category.id ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <Text className="text-white font-medium">
                  {category.icon} {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Priority Selection */}
          <Text className="text-gray-700 font-medium mb-2">Priority</Text>
          <View className="flex-row mb-4">
            {PRIORITIES.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                onPress={() => setSelectedPriority(priority.id as Todo['priority'])}
                className={`flex-1 py-3 rounded-lg mr-2 border-2 ${
                  selectedPriority === priority.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Text className={`text-center font-medium ${
                  selectedPriority === priority.id ? 'text-blue-600' : priority.color
                }`}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowAddForm(false)}
              className="flex-1 bg-gray-200 rounded-xl py-4 mr-2"
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addTodo}
              className="flex-1 bg-blue-500 rounded-xl py-4 ml-2"
            >
              <Text className="text-center text-white font-semibold">Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowAddForm(!showAddForm)}
        className={`absolute right-6 w-14 h-14 rounded-full shadow-lg items-center justify-center ${
          showAddForm ? 'bg-red-500' : 'bg-blue-500'
        }`}
        style={{ 
          bottom: showAddForm 
            ? (Platform.OS === 'android' ? keyboardHeight + 16 : 16)
            : 24,
          elevation: 8 
        }}
      >
        <Text className="text-white text-2xl font-bold">
          {showAddForm ? '×' : '+'}
        </Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
}