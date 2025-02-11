'use client'
// pages/index.js
import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  // Starting JSON configuration for the editor
  const [jsonConfig, setJsonConfig] = useState(`{
  "globalSettings": {
    "logging": true,
    "notificationEmail": "security-team@example.com"
  },
  "policies": [
    {
      "id": "policy-deny-org-access",
      "name": "Deny Access for Restricted Organization",
      "trigger": {
        "event": "login",
        "conditions": [
          { "type": "org_membership", "operator": "equals", "value": "orgA" },
          { "type": "application", "operator": "equals", "value": "appA" }
        ]
      },
      "actions": [
        { "name": "denyAccess", "parameters": { "message": "Access denied for Org A users." } }
      ]
    }
  ]
}`)

  // Handler for the Save button (mocked)
  const handleSave = () => {
    alert('Configuration saved!')
  }

  // Handler for the Test Run button (mocked)
  const handleTestRun = () => {
    alert('Test run executed!')
  }

  return (
    <div>
      <Head>
        <title>Auth0 Policy Editor</title>
        <meta name="description" content="Low-code/pro-code configuration dashboard for Auth0" />
      </Head>

      <header style={styles.header}>
        <h1>Auth0 Policy Editor</h1>
      </header>

      <main style={styles.main}>
        {/* Left Pane: Visual Builder */}
        <section style={styles.builderPane}>
          <h2>Visual Builder</h2>
          <div style={styles.palette}>
            <h3>Component Palette</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>Trigger Block</li>
              <li style={styles.listItem}>Condition Block</li>
              <li style={styles.listItem}>Action Block</li>
              <li style={styles.listItem}>MFA Block</li>
              <li style={styles.listItem}>User Role Block</li>
            </ul>
          </div>
          <div style={styles.canvas}>
            <p>Drag &amp; drop components here to build your policy.</p>
          </div>
        </section>

        {/* Right Pane: JSON Editor */}
        <section style={styles.jsonPane}>
          <h2>JSON Editor</h2>
          <textarea
            style={styles.textarea}
            value={jsonConfig}
            onChange={(e) => setJsonConfig(e.target.value)}
          />
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={handleSave}>Save</button>
            <button style={styles.button} onClick={handleTestRun}>Test Run</button>
          </div>
        </section>
      </main>
    </div>
  )
}

const styles = {
  header: {
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '1rem',
    textAlign: 'center'
  },
  main: {
    display: 'flex',
    height: 'calc(100vh - 80px)'
  },
  builderPane: {
    flex: 1,
    padding: '1rem',
    borderRight: '1px solid #ccc',
    overflowY: 'auto'
  },
  palette: {
    marginBottom: '1rem'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee'
  },
  canvas: {
    border: '2px dashed #ccc',
    height: '60%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  },
  jsonPane: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto'
  },
  textarea: {
    width: '100%',
    height: '70%',
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  buttonContainer: {
    marginTop: '1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
}
