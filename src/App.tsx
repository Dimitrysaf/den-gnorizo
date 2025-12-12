import Layout from './components/layout/Layout'

function App() {
  return (
    <Layout
      currentTab="home"
      onTabChange={(tab) => console.log('Tab changed to:', tab)}
    >
      <div>Main content</div>
    </Layout>
  )
}

export default App
