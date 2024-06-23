from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key="YOUR_ANTHROPIC_APIKEY")
@app.route('/api/chat', methods=['POST'])
def chat():
    messages = request.json['messages']
    messages[-1]['content'] += "(システム指示：Webページのコードを出力する場合は、Reactなどを要求されても、静的なHTML５だけで完結できるコードを生成してください。エラーになるのでJavaScriptは使用できません。単純なHTML5で実装してください。コードは一括で間に余計な文言を出力せずそのままHTMLファイルに張り付けて表示できる形にしてください。なお、コードは、Webページ内の50%の領域のiFrame内に表示してプレビューのために使用されます。前提として理解してコードを出力してください。)"
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=4096,
        messages=messages
    )
    
    bot_message = response.content[0].text
    
    code = ""
    if "```html" in bot_message:
        code_blocks = bot_message.split("```html")
        code = code_blocks[1].split("```")[0] if len(code_blocks) > 1 else ""
    
    return jsonify({
        'message': bot_message,
        'code': code
    })

if __name__ == '__main__':
    app.run(debug=True)