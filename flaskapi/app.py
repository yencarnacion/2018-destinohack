from flask import Flask
from flask import jsonify #
import subprocess
import shlex

app = Flask(__name__)

@app.route('/category/<cat>')
def category(cat):
    output = ""
    try:
        #p = subprocess.check_output(shlex.split('/usr/bin/jq', ))
        select = '[ .[] | select(.category=="'+cat+'") ]'
        p = subprocess.check_output(['/usr/bin/jq',select,'/home/yencarnacion/eventdb/db.json'])
        return(str(p))
    except subprocess.CalledProcessError, cpe:
        return(str(cpe.output))
        
    #return subprocess.call(shlex.split('/usr/bin/jq \'.[] | select(.category=="ballet")\' /home/yencarnacion/eventdb/db.json'))
    #p =  subprocess.check_output(['/usr/bin/jq', '.[] | select(.category=="ballet")','/home/yencarnacion/eventdb/json.db'])
    #return(str(p))
    #return jsonify(
    #    category=cat
    #)

if __name__ == "__main__":
        app.run(host='0.0.0.0')
