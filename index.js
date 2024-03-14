"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var pg = require("pg");
var app = (0, fastify_1.default)({ logger: true });
//Data Base configurations uesed here
var pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'apidata',
    password: 'admin',
    port: 1999,
});
//Used Get reuquest thta is fetching data from databse
app.get('/tasks', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var client, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.query('SELECT * FROM tasks')];
            case 2:
                result = _a.sent();
                client.release();
                reply.send(result.rows);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                reply.status(500).send(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Used POST request thAt is inserting data into database
app.post('/tasks', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, client, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = request.body, title = _a.title, description = _a.description;
                // Validate request body
                if (!title || !description) {
                    reply.status(400).send('Title and description are required');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _b.sent();
                return [4 /*yield*/, client.query('INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *', [title, description])];
            case 2:
                result = _b.sent();
                client.release();
                reply.send(result.rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                reply.status(500).send(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/tasks/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var idParam, taskId, client, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                idParam = request.params.id;
                if (!(typeof idParam === 'string')) return [3 /*break*/, 3];
                taskId = parseInt(idParam, 10);
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.query('SELECT * FROM tasks WHERE id = $1', [taskId])];
            case 2:
                result = _a.sent();
                client.release();
                if (result.rows.length === 0) {
                    reply.status(404).send('Task not found');
                }
                else {
                    reply.send(result.rows[0]);
                }
                return [3 /*break*/, 4];
            case 3:
                reply.status(400).send('Invalid task ID');
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                reply.status(500).send(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.put('/tasks/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, _a, title, description, client, result, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                taskId = parseInt(request.params.id, 10);
                _a = request.body, title = _a.title, description = _a.description;
                // Validate request body
                if (!title || !description) {
                    reply.status(400).send('Title and description are required');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _b.sent();
                return [4 /*yield*/, client.query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, taskId])];
            case 2:
                result = _b.sent();
                client.release();
                if (result.rows.length === 0) {
                    reply.status(404).send('Task not found');
                }
                else {
                    reply.send(result.rows[0]);
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                reply.status(500).send(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.delete('/tasks/:id', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, client, result, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                taskId = parseInt(request.params.id, 10);
                return [4 /*yield*/, pool.connect()];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId])];
            case 2:
                result = _a.sent();
                client.release();
                if (result.rows.length === 0) {
                    reply.status(404).send('Task not found');
                }
                else {
                    reply.send(result.rows[0]);
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                reply.status(500).send(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Flow Starts from here.
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, app.listen({ port: 3000 })];
            case 1:
                address = _a.sent();
                console.log("Server listening at ".concat(address));
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.error(err_6);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
start();
