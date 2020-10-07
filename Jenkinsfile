pipeline { 
    agent any 
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Deploy') { 
            steps { 
				script {
					def exists = fileExists 'C:\\NASA'
					if(!exists)	{
						powershell "New-Item -Path 'C:\\' -Name 'NASA' -ItemType 'directory'"
					}
					
					bat "del /S /F /Q C:\\NASA\\*"
					
					bat "xcopy /s \"C:\\Program Files (x86)\\Jenkins\\workspace\\NASA_master\\SpaceApp\\Applications\\UnofficialNASAApp\" C:\\NASA"
					
				}
            }
        }
    }
}