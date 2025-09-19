try {
  const fs = require('fs');
  console.log('Checking routes directory...');
  console.log('Routes directory exists:', fs.existsSync('./routes'));
  console.log('Auth routes exists:', fs.existsSync('./routes/auth.js'));
  console.log('Candidates routes exists:', fs.existsSync('./routes/candidates.js'));
  console.log('Social profiles routes exists:', fs.existsSync('./routes/socialProfiles.js'));

  const authRoutes = require('./routes/auth');
  const candidateRoutes = require('./routes/candidates');
  const socialProfileRoutes = require('./routes/socialProfiles');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/candidates', candidateRoutes);
  app.use('/api/social-profiles', socialProfileRoutes);
  
  console.log('All routes loaded successfully');
} catch (error) {
  console.log('Route loading error:', error);
}
