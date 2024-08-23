import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, IconButton, CircularProgress, Box, Fade, AppBar, Toolbar, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GitHubIcon from '@mui/icons-material/GitHub';
import { styled } from '@mui/material/styles';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface GroceryItem {
  id: bigint;
  name: string;
  emoji: string;
  completed: boolean;
}

interface Category {
  name: string;
  items: Array<{ id: bigint; name: string; emoji: string }>;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFFFF',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Header = () => (
  <AppBar position="static" color="transparent" elevation={0}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Grocery List App
      </Typography>
      <Button
        color="inherit"
        startIcon={<GitHubIcon />}
        href="https://github.com/GEMS-Gallery/aquamarine-realistic-crocodile-01917fbcfd37"
        target="_blank"
        rel="noopener noreferrer"
      >
        Show Code
      </Button>
    </Toolbar>
  </AppBar>
);

const Footer = () => (
  <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
    <Typography variant="body2" color="text.secondary" align="center">
      © 2024 Grocery List App. All rights reserved.
    </Typography>
  </Box>
);

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchCartItems();
    fetchCategories();
  }, []);

  const fetchCartItems = async () => {
    try {
      const items = await backend.getCartItems();
      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await backend.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToCart = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.addToCart(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const toggleItemCompletion = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.toggleItemCompletion(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error toggling item completion:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const removeFromCart = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.removeFromCart(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const getCategoryData = () => {
    const categoryCount: { [key: string]: number } = {};
    cartItems.forEach(item => {
      const category = categories.find(cat => cat.items.some(catItem => catItem.id === item.id));
      if (category) {
        categoryCount[category.name] = (categoryCount[category.name] || 0) + 1;
      }
    });
    return {
      labels: Object.keys(categoryCount),
      datasets: [
        {
          data: Object.values(categoryCount),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
          ],
        },
      ],
    };
  };

  const getItemCountData = () => {
    const categoryCount: { [key: string]: number } = {};
    categories.forEach(category => {
      categoryCount[category.name] = cartItems.filter(item =>
        category.items.some(catItem => catItem.id === item.id)
      ).length;
    });
    return {
      labels: Object.keys(categoryCount),
      datasets: [
        {
          label: 'Items per Category',
          data: Object.values(categoryCount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={0}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb: 3 }}>
                Categories
              </Typography>
              <Box sx={{ overflowY: 'auto', flexGrow: 1, pr: 2 }}>
                {categories.map((category) => (
                  <Box key={category.name} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>{category.name}</Typography>
                    <List>
                      {category.items.map((item) => (
                        <StyledListItem key={item.id.toString()}>
                          <ListItemText primary={`${item.emoji} ${item.name}`} />
                          <IconButton
                            edge="end"
                            onClick={() => addToCart(item.id)}
                            color="primary"
                            disabled={loadingItems[item.id.toString()]}
                          >
                            {loadingItems[item.id.toString()] ? (
                              <CircularProgress size={24} />
                            ) : (
                              <AddShoppingCartIcon />
                            )}
                          </IconButton>
                        </StyledListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Box>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={0}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb: 3 }}>
                Shopping Cart Analysis
              </Typography>
              <Grid container spacing={2} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ height: 200 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>Category Distribution</Typography>
                    <Pie data={getCategoryData()} options={{ responsive: true, maintainAspectRatio: false }} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ height: 200 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>Items per Category</Typography>
                    <Bar data={getItemCountData()} options={{ responsive: true, maintainAspectRatio: false }} />
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb: 3, mt: 4 }}>
                Shopping Cart
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
                  {cartItems.map((item) => (
                    <Fade in={!loadingItems[item.id.toString()]} key={item.id.toString()}>
                      <StyledListItem>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={item.completed}
                            onChange={() => toggleItemCompletion(item.id)}
                            color="secondary"
                            disabled={loadingItems[item.id.toString()]}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${item.emoji} ${item.name}`}
                          sx={{ textDecoration: item.completed ? 'line-through' : 'none' }}
                        />
                        <IconButton
                          edge="end"
                          onClick={() => removeFromCart(item.id)}
                          color="error"
                          disabled={loadingItems[item.id.toString()]}
                        >
                          {loadingItems[item.id.toString()] ? (
                            <CircularProgress size={24} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </StyledListItem>
                    </Fade>
                  ))}
                </List>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default App;
