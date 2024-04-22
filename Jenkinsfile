def name = 'pos-cli'

pipeline {
  agent any

  environment {
    MPKIT_TOKEN = credentials('MPKIT_TOKEN')
    MPKIT_EMAIL = "darek+ci@near-me.com"
    MPKIT_URL = "https://qa-17263.staging.oregon.platform-os.com"
    POS_PORTAL_PASSWORD = credentials('POS_PORTAL_PASSWORD')
  }

  stages {
    stage('Test 16') {
      agent { kubernetes { yaml podTemplate("16") } }
      options { timeout(time: 300, unit: 'SECONDS') }

      steps {
        container(name: 'node') {
          sh 'set -e'
          sh 'chown -R node:node * && chown node:node . && su -c "npm ci && npm test" node'
        }
      }
    }

    stage('Test 18') {
      agent { kubernetes { yaml podTemplate("18") } }
      options { timeout(time: 300, unit: 'SECONDS') }

      steps {
        container(name: 'node') {
          sh 'set -e'
          sh 'chown -R node:node * && chown node:node . && su -c "npm ci && npm test" node'
        }
      }
    }

    stage('Test 20') {
      agent { kubernetes { yaml podTemplate("20") } }
      options { timeout(time: 300, unit: 'SECONDS') }

      steps {
        container(name: 'node') {
          sh 'set -e'
          sh 'chown -R node:node * && chown node:node . && su -c "npm ci && npm test" node'
        }
      }
    }

    stage('Test latest') {
      agent { kubernetes { yaml podTemplate("20.11") } }

      steps {
        container(name: 'node') {
          sh 'npm install -g @platformos/pos-cli'
          sh 'pos-cli env list'
        }
      }
    }
  }
}

def podTemplate(version) {
  return """
        spec:
          nodeSelector:
            beta.kubernetes.io/arch: amd64
          containers:
          - name: node
            resources:
              limits:
                cpu: 2
                memory: 2Gi
              requests:
                cpu: 2
              memory: 2Gi
            image: 'node:${version}-alpine'
            imagePullPolicy: IfNotPresent
            command:
            - cat
            tty: true
"""
}
