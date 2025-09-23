import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

const TestRegistration: React.FC = () => {
  const testRegistration = async () => {
    console.log('🧪 Testing direct API call...');
    
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'AdminPass123!',
          firstName: 'Test',
          lastName: 'User',
          companyName: 'Test Company'
        }),
      });
      
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        alert('✅ Registration successful!');
      } else {
        alert('❌ Registration failed: ' + data.error);
      }
    } catch (error) {
      console.error('💥 Error:', error);
      alert('💥 Network error: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Registration Test
        </Typography>
        <Button 
          variant="contained" 
          onClick={testRegistration}
          size="large"
          sx={{ mt: 3 }}
        >
          Test Direct API Call
        </Button>
      </Box>
    </Container>
  );
};

export default TestRegistration;