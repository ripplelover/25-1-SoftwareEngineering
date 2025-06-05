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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var Course_1 = require("../models/Course");
var User_1 = require("../models/User");
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1["default"].Router();
// 교수의 과목 목록 조회
router.get('/professor/:professorId', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Course_1.Course.find({ professorId: req.params.professorId })];
            case 1:
                courses = _a.sent();
                res.json(courses);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 학생의 수강 과목 목록 조회
router.get('/student/:studentId', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Course_1.Course.find({ students: req.params.studentId })];
            case 1:
                courses = _a.sent();
                res.json(courses);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 전체 과목 목록 조회 (학생용)
router.get('/', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Course_1.Course.find()];
            case 1:
                courses = _a.sent();
                res.json(courses);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 과목 등록 (교수용)
router.post('/', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, professor, room, time, professorId, course, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, professor = _a.professor, room = _a.room, time = _a.time, professorId = _a.professorId;
                course = new Course_1.Course({
                    name: name_1,
                    professor: professor,
                    room: room,
                    time: time,
                    professorId: professorId,
                    students: []
                });
                return [4 /*yield*/, course.save()];
            case 1:
                _b.sent();
                res.status(201).json(course);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 과목 삭제 (교수용)
router["delete"]('/:courseId', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Course_1.Course.findByIdAndDelete(req.params.courseId)];
            case 1:
                _a.sent();
                res.json({ message: '과목이 삭제되었습니다.' });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 수강신청 (학생용)
router.post('/enroll/:courseId', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, course, studentCourses, newCourseTime, _i, studentCourses_1, enrolledCourse, enrolledTime, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                studentId = req.body.studentId;
                return [4 /*yield*/, Course_1.Course.findById(req.params.courseId)];
            case 1:
                course = _a.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).json({ message: '과목을 찾을 수 없습니다.' })];
                }
                // 이미 수강신청한 과목인지 확인
                if (course.students.includes(studentId)) {
                    return [2 /*return*/, res.status(400).json({ message: '이미 수강신청한 과목입니다.' })];
                }
                return [4 /*yield*/, Course_1.Course.find({ students: studentId })];
            case 2:
                studentCourses = _a.sent();
                newCourseTime = course.time.split(' ')[1];
                for (_i = 0, studentCourses_1 = studentCourses; _i < studentCourses_1.length; _i++) {
                    enrolledCourse = studentCourses_1[_i];
                    enrolledTime = enrolledCourse.time.split(' ')[1];
                    if (enrolledTime === newCourseTime) {
                        return [2 /*return*/, res.status(400).json({ message: '시간표가 충돌합니다.' })];
                    }
                }
                course.students.push(studentId);
                return [4 /*yield*/, course.save()];
            case 3:
                _a.sent();
                res.json({ message: '수강신청이 완료되었습니다.', course: course });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// 수강신청 취소 (학생용)
router.post('/drop/:courseId', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId_1, course, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                studentId_1 = req.body.studentId;
                return [4 /*yield*/, Course_1.Course.findById(req.params.courseId)];
            case 1:
                course = _a.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).json({ message: '과목을 찾을 수 없습니다.' })];
                }
                course.students = course.students.filter(function (id) { return id !== studentId_1; });
                return [4 /*yield*/, course.save()];
            case 2:
                _a.sent();
                res.json({ message: '수강신청이 취소되었습니다.' });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 과목별 수강 학생 목록 조회
router.get('/:courseId/students', auth_1["default"], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, students, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Course_1.Course.findById(req.params.courseId)];
            case 1:
                course = _a.sent();
                if (!course)
                    return [2 /*return*/, res.status(404).json({ message: '과목을 찾을 수 없습니다.' })];
                return [4 /*yield*/, User_1.User.find({ _id: { $in: course.students } }, 'name studentId email department major grade')];
            case 2:
                students = _a.sent();
                res.json(students);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.status(500).json({ message: '서버 에러가 발생했습니다.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
