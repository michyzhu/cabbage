from app.main import app
if __name__ == "__main__":
  app.run(debug=True,port=5000)
  #app.run(debug=True,port=process.env.PORT)