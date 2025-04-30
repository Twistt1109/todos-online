package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	r := gin.Default()

	// CORS中间件
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// 初始化数据库
	db := initDB("todos.db")

	// 路由设置
	r.GET("/todos", func(c *gin.Context) {
		var todos []Todo
		db.Find(&todos)
		c.JSON(http.StatusOK, todos)
	})

	r.POST("/todos", func(c *gin.Context) {
		var input struct {
			Text string `json:"text"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		todo := Todo{Text: input.Text}
		db.Create(&todo)
		c.JSON(http.StatusCreated, todo)
	})

	r.DELETE("/todos/:id", func(c *gin.Context) {
		id := c.Param("id")
		db.Delete(&Todo{}, id)
		c.JSON(http.StatusOK, gin.H{"success": true})
	})

	r.Run(":8888")
}

type Todo struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Text string `json:"text"`
}

func initDB(filepath string) *gorm.DB {
	dsn := "root:Twist@741852@tcp(twist911.kejipp.cn:3309)/todos?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("数据库连接失败: " + err.Error())
	}
	db.AutoMigrate(&Todo{})
	return db
}
