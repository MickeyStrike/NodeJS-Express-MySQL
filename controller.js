'use strict'

const connection = require('./connect')
const jwt = require('jsonwebtoken')

exports.getAllUser = (req, res) => {
    connection.query(`SELECT * FROM user`, (err, rows, field) => {
        if (err) {
            throw err
        }
        else {
            return res.status(200).send({
                message: 'OK',
                result: rows
            })
        }
    })
}

exports.getUserByID = (req, res) => {
    const id = req.params.id

    connection.query(`SELECT * FROM user WHERE id=?`, [id], (err, rows, field) => {
        if (err) {
            throw err
        }
        else {
            if (rows.length > 0) {
                const token = jwt.sign({
                    tokenEncode: 'Bebas'
                }, 'Secret')
                return res.status(200).send({
                    message: 'OK',
                    result: rows,
                    token: token
                })
            }
            else {
                return res.status(404).send({
                    message: 'data tidak ditemukan'
                })
            }
        }
    })
}

exports.getNamaUsername = (req, res) => {
    connection.query(`Select username,nama FROM user WHERE username = 'user1'`, (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length === 0) {
                return res.status(200).send({
                    message: 'Data Not Found',
                })
            } else {
                return res.status(200).send({
                    message: 'OKE',
                    result: rows
                })
            }
        }
    })
}

exports.getUsername = (req, res) => {
    const nama = req.params.nama
    connection.query(`Select id FROM user WHERE nama=?`, [nama], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length <= 0) {
                return res.status(200).send({
                    message: 'Data Not Found'
                })
            } else {
                return res.status(200).send({
                    message: 'OKE',
                    result: rows
                })
            }
        }
    })
}

exports.getSemua = (req, res) => {
    connection.query(`Select * FROM user`, (err, rows, field) => {
        if (err) {
            throw err
        } else {
            rows.unshift({ 'ganjil': [], 'genap': [] })
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].id % 2 === 0) {
                    rows[i]['status'] = 'genap'
                } else if (rows[i].id % 2 === 1) {
                    rows[i]['status'] = 'ganjil'
                }
            }
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].id % 2 === 0) {
                    rows[0][`genap`].push(rows[i])
                } else if (rows[i].id % 2 === 1) {
                    rows[0][`ganjil`].push(rows[i])
                }
            }
            return res.status(200).send({
                message: 'OKE',
                result: rows.slice(0, 1)
            })
        }
    })
}

exports.getNamaAjah = (req, res) => {
    connection.query(`SELECT nama FROM user`, (err, rows, field) => {
        if (err) {
            throw err
        } else {
            return res.status(200).send({
                message: 'Woke',
                result: rows
            })
        }
    })
}

exports.getDataFromID = (req, res) => {
    const id = req.params.id
    connection.query(`SELECT * FROM user WHERE id=?`, [id], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length > 0) {
                return res.status(200).send({
                    message: 'All Data Oke',
                    result: rows
                })
            } else {
                return res.status(404).send({
                    message: 'Data Not Found'
                })
            }
        }
    })
}

exports.getChallenge = (req, res) => {
    connection.query(`SELECT user.username,history.username,
    history.activities,history.date FROM history INNER JOIN user ON history.username = user.username`, (err, rows, field) => {
        if (err) {
            throw err
        } else {
            let username = []
            let resultBaru = []
            for (let i = 0; i < rows.length; i++) {
                if (username.length === 0) {
                    username.push(rows[i].username)
                }
                for (let j = 0; j < username.length; j++) {
                    if (username[j] === rows[i].username) {
                        break
                    } else if (j === username.length - 1) {
                        username.push(rows[i].username)
                    }
                }
            }
            //sorting
            username.sort()
            for (let i = 0; i < username.length; i++) {
                resultBaru.push({ 'key': i, 'username': username[i], "all_activities": [] })
                for (let j = 0; j < rows.length; j++) {
                    if (username[i] === rows[j].username) {
                        for (let k = j; k < rows.length; k++) {
                            resultBaru[i]['all_activities'].push({ 'activities': rows[k]['activities'], 'date': rows[k]['date'] })
                            break
                        }
                    }
                }
            }
            // console.log(username)
            return res.status(200).send({
                message: 'OK!',
                result: resultBaru
            })
        }
    })
}

exports.postData = (req, res) => {
    const username = req.body.usernameKey
    const activities = req.body.activitiesKey
    const date = req.body.dateKey
    connection.query(`INSERT INTO history (username,activities,date) VALUES (?,?,?)`, [username, activities, date], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            return res.status(200).send({
                message: 'OK!'
            })
        }
    })
}

exports.updateData = (req, res) => {
    const activities = req.body.activitiesKey
    const id = req.params.idKey
    connection.query('SELECT id FROM history WHERE id=?', [id], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length > 0) {
                connection.query('UPDATE history SET activities = ? WHERE id=?', [activities, id], (err, rows, field) => {
                    if (err) {
                        throw err
                    } else {
                        return res.status(200).send({
                            message: 'OK!',
                            result: rows
                        })
                    }
                })
            }
            else {
                return res.status(200).send({
                    message: 'Data Not Found!',
                })
            }
        }
    })
}

exports.updateDate = (req, res) => {
    const date = req.body.dateKey
    const id = req.params.id
    connection.query('SELECT id FROM history WHERE id=?', [id], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length > 0) {
                connection.query('UPDATE history SET date =? WHERE id=?', [date, id], (err, rows, field) => {
                    if (err) {
                        throw err
                    } else {
                        return res.status(200).send({
                            message: 'OK!',
                            result: rows
                        })
                    }
                })
            } else {
                return res.status(404).send({
                    message: 'Data Not Found'
                })
            }
        }
    })
}

exports.deleteData = (req, res) => {
    const id = req.params.id
    connection.query('SELECT id FROM history WHERE id=?', [id], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length > 0) {
                connection.query('DELETE FROM history WHERE id=?', [id], (err, rows, field) => {
                    if (err) {
                        throw err
                    } else {
                        return res.status(200).send({
                            message: 'OK!',
                            status: 'DONE DELETE!',
                            result: rows
                        })
                    }
                })
            } else {
                return res.status(404).send({
                    message: 'Data Not Found!'
                })
            }
        }
    })
}

exports.addData = (req, res) => {
    const username = req.body.username
    const activities = req.body.activities
    const date = req.body.date
    connection.query('INSERT INTO history (username,activities,date) VALUES (?,?,?)', [username, activities, date], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            return res.status(200).send({
                message: 'OK!',
                result: rows
            })
        }
    })
}

exports.updateActivities = (req, res) => {
    const id = req.params.id
    const activities = req.body.activities
    connection.query('SELECT id FROM history WHERE id = ?', [id], (err, rows, field) => {
        if (err) {
            throw err
        } else {
            if (rows.length > 0) {
                connection.query('UPDATE history SET activities = ? WHERE id=?', [activities, id], (err, rows, field) => {
                    if (err) {
                        throw err
                    } else {
                        return res.status(200).send({
                            message: 'OK!',
                            result: rows
                        })
                    }
                })
            } else {
                return res.status(404).send({
                    message: 'Data Not Found!',
                    ErrMessage: 'Check your id'
                })
            }
        }
    })

}